sap.ui.define([
    "sap/ui/core/mvc/ControllerExtension", "sap/ui/model/json/JSONModel", "./SectionNavigation"
], function (ControllerExtension, JSONModel, SectionNavigation) {
    "use strict";

    return ControllerExtension.extend("delegacy-ui.ext.controller.ObjectPage", {
        override: {
            onInit: function () {
                this.base.getView().setModel(new JSONModel({
                    hasPrevious: false, hasNext: false, previousId: null, nextId: null
                }), "sectionNavigation");
            },
            onAfterRendering: function () {
                this._connectNavigation();
            },
            routing: {
                onAfterBinding: function () {
                    this._connectNavigation();
                }
            },
            onExit: function () {
                if (this._layout) {
                    this._layout.detachSectionChange(this._onSectionChange, this);
                    this._layout.removeEventDelegate(this._layoutDelegate);
                }
                this.base.getView().getModel("sectionNavigation").destroy();
            }
        },

        _connectNavigation: function () {
            const view = this.base.getView();
            const layout = view.getContent().find(control => control.isA("sap.uxap.ObjectPageLayout"));
            if (!layout) {
                return;
            }
            if (this._layout !== layout) {
                this._layout = layout;
                this._layoutDelegate = { onAfterRendering: () => this._updateNavigation() };
                layout.addEventDelegate(this._layoutDelegate);
                layout.attachSectionChange(this._onSectionChange, this);
            }
            this._updateNavigation();
        },

        _onSectionChange: function (event) {
            this._updateNavigation(event.getParameter("section").getId());
        },

        _updateNavigation: function (selectedId) {
            const view = this.base.getView();
            const model = view.getModel("sectionNavigation");
            const state = SectionNavigation.getState(this._layout, selectedId);
            SectionNavigation.update(this._layout, model, selectedId);
            const previous = state.sections[state.index - 1];
            const next = state.sections[state.index + 1];
            model.setProperty("/previousId", previous ? view.getLocalId(previous.getId()) : null);
            model.setProperty("/nextId", next ? view.getLocalId(next.getId()) : null);
        }
    });
});
