import PageController from "sap/fe/core/PageController";
import JSONModel from "sap/ui/model/json/JSONModel";
import Fragment from "sap/ui/core/Fragment";
import Element from "sap/ui/core/Element";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import type Context from "sap/ui/model/odata/v4/Context";
import type ODataModel from "sap/ui/model/odata/v4/ODataModel";
import type ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import type ODataContextBinding from "sap/ui/model/odata/v4/ODataContextBinding";
import type SelectDialog from "sap/m/SelectDialog";
import type {
    SelectDialog$ConfirmEvent,
    SelectDialog$LiveChangeEvent
} from "sap/m/SelectDialog";
import type Event from "sap/ui/base/Event";
import type StandardListItem from "sap/m/StandardListItem";
import type IconTabBar from "sap/m/IconTabBar";
import type { IconTabBar$SelectEvent } from "sap/m/IconTabBar";
import type IconTabFilter from "sap/m/IconTabFilter";

interface EmployeeData {
    ID?: string;
    name?: string;
    lastName?: string;
    fullName?: string;
    position?: string;
    postal_code?: string;
    city?: string;
    address?: string;
    birthDate?: string;
    birthPlace?: string;
    mothersName?: string;
    taxNumber?: string;
    initials?: string;
}

interface UserContextData {
    ID: string;
    isBackoffice: boolean;
}

interface DynamicPageLike {
    getHeaderExpanded(): boolean;
    setHeaderExpanded(expanded: boolean): unknown;
    getPreserveHeaderStateOnScroll(): boolean;
    setPreserveHeaderStateOnScroll(preserve: boolean): unknown;
    setToggleHeaderOnTitleClick?(toggle: boolean): unknown;
}


/**
 * Workspace controller.
 *
 * The posting tables stay metadata-driven Fiori elements building blocks.
 * Personal data is edited inline in a local buffer and saved through a dedicated
 * action, without creating a draft from this custom page.
 *
 * @namespace delegacy-ui.ext.view
 */
export default class Main extends PageController {
    private _employeeContext?: Context;
    private _employeeListBinding?: ODataListBinding;
    private _employeeDialog?: SelectDialog;
    private _profileEditSnapshot?: EmployeeData;
    private _profileSaveActionBinding?: ODataContextBinding;
    private _profileLoadInFlight = false;
    private _profileInitialized = false;
    private _selectedEmployeeId?: string;
    private _selectedTabKey = "car";
    private _tabResizeObserver?: ResizeObserver;
    private _observedTabHead?: HTMLElement;

    public onInit(): void {
        super.onInit();

        const view = this.getView()!;

        // A custom Page is not treated as a List Report by Fiori elements.
        // Enable its CRUD lifecycle so the Table building blocks generate their
        // metadata-driven standard Create/Delete actions. The tables themselves
        // remain read-only, so rows are never rendered as inline edit fields.
        (view.getModel("ui") as JSONModel | undefined)?.setProperty("/isEditable", true);

        // Do not replace the Fiori elements "ui" model. EditFlow owns that model
        // and uses it for draft/edit state. Workspace-only state gets its own model.
        view.setModel(new JSONModel({
            profileLoaded: false,
            hasEmployee: false,
            showEmployeeSearch: false,
            employeeCount: 0,
            profileUnavailable: false,
            profileEditing: false,
            profileBusy: false
        }), "workspace");

        // Small display-only model for computed values such as initials/full name.
        view.setModel(new JSONModel({}), "profile");

        view.addEventDelegate({
            onAfterRendering: () => {
                this._configureStaticPageHeader();
                this._observeTabHeaderResize();

                const tabBar = this.byId("workspaceTabs") as IconTabBar | undefined;
                if (tabBar?.getSelectedKey() === "profile") {
                    void this._ensureEmployeeProfileLoaded();
                }
            }
        });

    }

    public onExit(): void {
        this._tabResizeObserver?.disconnect();
        this._tabResizeObserver = undefined;
        this._observedTabHead = undefined;
        this._employeeDialog?.destroy();
        this._employeeDialog = undefined;
        this._profileSaveActionBinding?.destroy();
        this._profileSaveActionBinding = undefined;
        this._employeeListBinding?.destroy();
        this._employeeListBinding = undefined;
        super.onExit();
    }

    public async onEmployeeSearch(): Promise<void> {
        const stateModel = this._getWorkspaceModel();
        if (stateModel.getProperty("/profileEditing")) {
            return;
        }

        if (!this._employeeDialog) {
            this._employeeDialog = await Fragment.load({
                id: this.getView()!.getId(),
                name: "delegacy-ui.ext.fragment.EmployeeSelect",
                controller: this
            }) as SelectDialog;
            this.getView()!.addDependent(this._employeeDialog);
        }

        const itemsBinding = this._employeeDialog.getBinding("items") as ODataListBinding | undefined;
        itemsBinding?.filter([]);
        this._employeeDialog.open("");
    }

    public onEmployeeSearchLiveChange(event: SelectDialog$LiveChangeEvent): void {
        const value = String(event.getParameter("value") ?? "").trim();
        const dialog = event.getSource() as SelectDialog;
        const binding = dialog.getBinding("items") as ODataListBinding | undefined;

        if (!value) {
            binding?.filter([]);
            return;
        }

        binding?.filter(new Filter({
            filters: [
                new Filter("ID", FilterOperator.Contains, value),
                new Filter("name", FilterOperator.Contains, value),
                new Filter("lastName", FilterOperator.Contains, value),
                new Filter("position", FilterOperator.Contains, value)
            ],
            and: false
        }));
    }

    public async onEmployeeSelected(event: SelectDialog$ConfirmEvent): Promise<void> {
        const selectedItem = event.getParameter("selectedItem") as StandardListItem | undefined;
        const context = selectedItem?.getBindingContext() as Context | undefined;
        const employeeId = context?.getProperty("ID");

        if (!employeeId) {
            return;
        }

        const employeeContext = await this._requestEmployeeById(
            this._getODataModel(),
            String(employeeId)
        );

        if (employeeContext) {
            await this._setEmployeeContext(employeeContext);
        }
    }

    public onEmployeeSearchCancel(): void {
        // The SelectDialog closes itself. No state change is required.
    }

    public onTabSelect(event: IconTabBar$SelectEvent): void {
        const item = event.getParameter("item") as IconTabFilter | undefined;
        const itemKey = item?.getKey();

        // IconTabHeader finishes its strip layout after firing select. Run after
        // that synchronous UI5 update, but still before the browser can paint.
        queueMicrotask(() => {
            const tabBar = this.byId("workspaceTabs") as IconTabBar | undefined;
            if (item && tabBar?.getSelectedKey() === itemKey) {
                this._animateTabIndicator(item);
            }
        });
        if (item?.getKey() === "profile") {
            void this._ensureEmployeeProfileLoaded();
        }
    }

    /**
     * Starts draft-free inline editing using a local JSON model copy.
     */
    public onInlineEditPersonalData(event?: Event): void {
        event?.preventDefault();
        event?.cancelBubble();

        const stateModel = this._getWorkspaceModel();
        if (!stateModel.getProperty("/hasEmployee") || stateModel.getProperty("/profileBusy")) {
            return;
        }

        const profileModel = this.getView()!.getModel("profile") as JSONModel;
        const currentData = profileModel.getData() as EmployeeData;
        this._profileEditSnapshot = { ...currentData };
        profileModel.setData({ ...currentData });
        stateModel.setProperty("/profileEditing", true);
    }

    /**
     * Saves the local edit buffer directly to the active Employees record.
     * This custom Personal Data tab never creates or activates a CAP draft.
     */
    public async onInlineSavePersonalData(event?: Event): Promise<void> {
        event?.preventDefault();
        event?.cancelBubble();

        const stateModel = this._getWorkspaceModel();
        const profileModel = this.getView()!.getModel("profile") as JSONModel;
        const data = { ...profileModel.getData() } as EmployeeData;
        const employeeId = data.ID ?? this._selectedEmployeeId;

        if (!employeeId || stateModel.getProperty("/profileBusy")) {
            return;
        }

        stateModel.setProperty("/profileBusy", true);
        this._profileSaveActionBinding?.destroy();

        const saveBinding = this._getODataModel().bindContext(
            "/updatePersonalData(...)"
        ) as ODataContextBinding;
        this._profileSaveActionBinding = saveBinding;

        saveBinding.setParameter("ID", employeeId);
        saveBinding.setParameter("name", data.name ?? null);
        saveBinding.setParameter("lastName", data.lastName ?? null);
        saveBinding.setParameter("position", data.position ?? null);
        saveBinding.setParameter("postal_code", data.postal_code ?? null);
        saveBinding.setParameter("city", data.city ?? null);
        saveBinding.setParameter("address", data.address ?? null);
        saveBinding.setParameter("birthDate", data.birthDate ?? null);
        saveBinding.setParameter("birthPlace", data.birthPlace ?? null);
        saveBinding.setParameter("mothersName", data.mothersName ?? null);
        saveBinding.setParameter("taxNumber", data.taxNumber ?? null);

        try {
            await saveBinding.invoke("$auto");

            const activeContext = await this._requestEmployeeById(
                this._getODataModel(),
                employeeId
            );
            if (activeContext) {
                await this._setEmployeeContext(activeContext);
            }
            this._profileEditSnapshot = undefined;
            stateModel.setProperty("/profileEditing", false);
        } catch (error) {
            // Keep the local values and edit mode intact so the user can retry.
            console.error("Failed to save personal data", error);
        } finally {
            saveBinding.destroy();
            if (this._profileSaveActionBinding === saveBinding) {
                this._profileSaveActionBinding = undefined;
            }
            stateModel.setProperty("/profileBusy", false);
        }
    }

    /**
     * Cancels draft-free editing by restoring the local snapshot.
     */
    public onInlineCancelPersonalData(event?: Event): void {
        event?.preventDefault();
        event?.cancelBubble();

        const profileModel = this.getView()!.getModel("profile") as JSONModel;
        if (this._profileEditSnapshot) {
            profileModel.setData({ ...this._profileEditSnapshot });
        }
        this._profileEditSnapshot = undefined;
        this._getWorkspaceModel().setProperty("/profileEditing", false);
    }

    private async _ensureEmployeeProfileLoaded(): Promise<void> {
        if (this._profileInitialized || this._profileLoadInFlight) {
            return;
        }

        this._profileLoadInFlight = true;
        try {
            this._profileInitialized = await this._loadEmployeeProfile();
        } finally {
            this._profileLoadInFlight = false;
        }
    }

    private _getWorkspaceModel(): JSONModel {
        return this.getView()!.getModel("workspace") as JSONModel;
    }

    private _getODataModel(): ODataModel {
        const extensionModel = this.getExtensionAPI().getModel();
        const viewModel = this.getView()?.getModel();
        const componentModel = this.getOwnerComponent()?.getModel();
        const model = (extensionModel ?? viewModel ?? componentModel) as ODataModel | undefined;

        if (!model || typeof model.bindContext !== "function") {
            throw new Error("The default AppService OData V4 model is not available on the custom page yet.");
        }

        return model;
    }

    private async _loadEmployeeProfile(): Promise<boolean> {
        const view = this.getView()!;
        const stateModel = this._getWorkspaceModel();

        stateModel.setProperty("/profileLoaded", false);
        stateModel.setProperty("/profileUnavailable", false);
        stateModel.setProperty("/profileEditing", false);

        try {
            const model = this._getODataModel();

            // UserContext is served by CAP and therefore uses exactly req.user.id.
            const userContext = await this._requestUserContext(model);
            stateModel.setProperty("/showEmployeeSearch", userContext.isBackoffice);

            let ownContext = await this._requestEmployeeById(model, userContext.ID);

            // Existing backend logic can lazily create the current Employees row
            // on first access. Retry the active read once in that case.
            if (!ownContext) {
                await new Promise<void>((resolve) => window.setTimeout(resolve, 0));
                ownContext = await this._requestEmployeeById(model, userContext.ID);
            }

            stateModel.setProperty("/hasEmployee", Boolean(ownContext));
            stateModel.setProperty("/profileUnavailable", !ownContext);

            if (ownContext) {
                await this._setEmployeeContext(ownContext);
            } else {
                (view.getModel("profile") as JSONModel).setData({});
                this._setProfileBindingContext(undefined);
            }

            return Boolean(ownContext);
        } catch (error) {
            console.error("Failed to load personal data from CAP UserContext", error);
            stateModel.setProperty("/hasEmployee", false);
            stateModel.setProperty("/showEmployeeSearch", false);
            stateModel.setProperty("/profileUnavailable", true);
            (view.getModel("profile") as JSONModel).setData({});
            this._setProfileBindingContext(undefined);
            return false;
        } finally {
            stateModel.setProperty("/profileLoaded", true);
        }
    }

    private async _requestUserContext(model: ODataModel): Promise<UserContextData> {
        const binding = model.bindContext("/UserContext");

        try {
            const userContext = await binding.requestObject() as UserContextData | undefined;

            if (!userContext?.ID) {
                throw new Error("CAP UserContext did not return req.user.id");
            }

            return {
                ID: String(userContext.ID),
                isBackoffice: Boolean(userContext.isBackoffice)
            };
        } finally {
            binding.destroy();
        }
    }

    private async _requestEmployeeById(model: ODataModel, userId: string): Promise<Context | undefined> {
        // Keep the binding alive as long as its Context is used by the profile.
        this._employeeListBinding?.destroy();

        const binding = model.bindList(
            "/Employees",
            undefined,
            undefined,
            [
                new Filter("ID", FilterOperator.EQ, userId),
                new Filter("IsActiveEntity", FilterOperator.EQ, true)
            ],
            {
                $select: "ID,IsActiveEntity,HasActiveEntity,HasDraftEntity,name,lastName,fullName,position,postal_code,city,address,birthDate,birthPlace,mothersName,taxNumber"
            }
        ) as ODataListBinding;

        this._employeeListBinding = binding;

        let contexts = await binding.requestContexts(0, 1);
        if (contexts.length === 0) {
            binding.refresh();
            contexts = await binding.requestContexts(0, 1);
        }

        return contexts[0];
    }

    private async _setEmployeeContext(context: Context): Promise<void> {
        this._employeeContext = context;
        this._setProfileBindingContext(context);

        const employee = await context.requestObject() as EmployeeData;
        this._selectedEmployeeId = employee.ID ? String(employee.ID) : this._selectedEmployeeId;

        const view = this.getView()!;
        const profileModel = view.getModel("profile") as JSONModel;
        const stateModel = this._getWorkspaceModel();

        const fullName = employee.fullName
            || [employee.name, employee.lastName].filter(Boolean).join(" ")
            || employee.ID
            || "";

        profileModel.setData({
            ...employee,
            fullName,
            initials: this._createInitials(employee.name, employee.lastName, fullName)
        });

        stateModel.setProperty("/hasEmployee", true);
        stateModel.setProperty("/profileUnavailable", false);
    }

    private _getDynamicPage(): DynamicPageLike | undefined {
        const directPage = this.byId("Main") as unknown;
        const viewDom = this.getView()?.getDomRef() as HTMLElement | null;
        const dynamicPageDom = viewDom?.querySelector<HTMLElement>(".sapFDynamicPage");
        const registeredPage = dynamicPageDom?.id
            ? Element.getElementById(dynamicPageDom.id) as unknown
            : undefined;

        return [directPage, registeredPage].find((candidate) => {
            const page = candidate as DynamicPageLike | undefined;
            return typeof page?.getHeaderExpanded === "function"
                && typeof page.setHeaderExpanded === "function"
                && typeof page.getPreserveHeaderStateOnScroll === "function"
                && typeof page.setPreserveHeaderStateOnScroll === "function";
        }) as DynamicPageLike | undefined;
    }

    private _configureStaticPageHeader(): void {
        const page = this._getDynamicPage();
        if (!page) {
            return;
        }

        page.setPreserveHeaderStateOnScroll(true);
        page.setToggleHeaderOnTitleClick?.(false);
        page.setHeaderExpanded(false);
    }

    private _observeTabHeaderResize(): void {
        const tabBar = this.byId("workspaceTabs") as IconTabBar | undefined;
        const tabBarDom = tabBar?.getDomRef() as HTMLElement | null;
        const head = tabBarDom?.querySelector<HTMLElement>(".sapMITBHead");

        if (!head || this._observedTabHead === head || typeof ResizeObserver === "undefined") {
            return;
        }

        this._tabResizeObserver?.disconnect();
        this._tabResizeObserver = new ResizeObserver(() => {
            this._syncSelectedTabIndicator();
        });
        this._tabResizeObserver.observe(head);
        this._observedTabHead = head;
    }

    private _syncSelectedTabIndicator(): void {
        const tabBar = this.byId("workspaceTabs") as IconTabBar | undefined;
        const tabBarDom = tabBar?.getDomRef() as HTMLElement | null;
        const head = tabBarDom?.querySelector<HTMLElement>(".sapMITBHead");
        const selectedItem = (tabBar?.getItems() as IconTabFilter[] | undefined)?.find(
            (tabItem) => tabItem.getKey() === tabBar?.getSelectedKey()
        );

        if (!selectedItem || !tabBarDom?.classList.contains("workspaceAnimatedIndicator") || !head) {
            return;
        }

        head.classList.add("workspaceIndicatorNoAnimation");
        this._animateTabIndicator(selectedItem);
        void head.offsetWidth;
        head.classList.remove("workspaceIndicatorNoAnimation");
    }

    private _setProfileBindingContext(context?: Context): void {
        const profileContent = this.byId("profileContent");
        if (context) {
            profileContent?.setBindingContext(context);
        } else {
            // UI5 accepts null to prevent an inherited parent context from being
            // propagated when no employee profile is available.
            profileContent?.setBindingContext(null as unknown as Context);
        }
    }

    private _animateTabIndicator(item?: IconTabFilter): void {
        const tabBar = this.byId("workspaceTabs") as IconTabBar | undefined;
        const tabBarDom = tabBar?.getDomRef() as HTMLElement | null;
        const head = tabBarDom?.querySelector<HTMLElement>(".sapMITBHead");
        const items = tabBar?.getItems() as IconTabFilter[] | undefined;
        const previousItem = items?.find((tabItem) => tabItem.getKey() === this._selectedTabKey);

        if (!item || !tabBarDom || !head || !previousItem) {
            return;
        }

        const measure = (tabItem: IconTabFilter): { x: number; width: number } | undefined => {
            const itemDom = tabItem.getDomRef() as HTMLElement | null;
            const text = itemDom?.querySelector<HTMLElement>(".sapMITBText");
            const icon = itemDom?.querySelector<HTMLElement>(".sapMITBFilterIcon");
            if (!itemDom || !text || !icon) {
                return undefined;
            }

            const headRect = head.getBoundingClientRect();
            const textRect = text.getBoundingClientRect();
            const iconRect = icon.getBoundingClientRect();
            const rootFontSize = Number.parseFloat(
                window.getComputedStyle(document.documentElement).fontSize
            );
            const markerExtension = rootFontSize * 0.1875;
            const width = textRect.width + markerExtension * 2;
            return {
                // Match the CSS marker exactly: both use a 0.1875rem extension
                // on either side of the rendered caption.
                x: iconRect.left + iconRect.width / 2
                    - headRect.left - width / 2,
                width
            };
        };

        const from = measure(previousItem);
        if (!from) {
            return;
        }

        if (!tabBarDom.classList.contains("workspaceAnimatedIndicator")) {
            head.classList.add("workspaceIndicatorNoAnimation");
            head.style.setProperty("--workspace-tab-indicator-x", String(from.x) + "px");
            head.style.setProperty("--workspace-tab-indicator-width", String(from.width) + "px");
            tabBarDom.classList.add("workspaceAnimatedIndicator");
            void head.offsetWidth;
            head.classList.remove("workspaceIndicatorNoAnimation");
        }

        const to = measure(item);
        if (!to) {
            return;
        }

        head.style.setProperty("--workspace-tab-indicator-x", String(to.x) + "px");
        head.style.setProperty("--workspace-tab-indicator-width", String(to.width) + "px");
        this._selectedTabKey = item.getKey();
    }

    private _createInitials(firstName?: string, lastName?: string, fullName?: string): string {
        const explicit = [firstName, lastName]
            .filter(Boolean)
            .map((part) => String(part).trim().charAt(0))
            .join("")
            .toUpperCase();

        if (explicit) {
            return explicit.slice(0, 2);
        }

        return String(fullName ?? "")
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part.charAt(0))
            .join("")
            .toUpperCase();
    }
}
