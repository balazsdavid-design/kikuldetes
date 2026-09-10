sap.ui.define(["sap/m/VBox", "sap/m/VBoxRenderer", "sap/m/Label"], function (VBox, VBoxRenderer, Label) {
    "use strict";

    const fields = ["date", "from_postcode", "from_city", "from_where", "from_client",
        "to_postcode", "to_city", "to_where", "to_client", "mileage", "daily_expense"];

    return VBox.extend("delegacy-ui.ext.control.TripDataContainer", {
        renderer: VBoxRenderer,

        onAfterRendering: function () {
            VBox.prototype.onAfterRendering?.apply(this, arguments);
            // The standard macro creates its grid asynchronously. Observe only
            // rendering changes; creation, selection and the toolbar stay with FE.
            this._tripHeaderObserver?.disconnect();
            this._tripHeaderObserver = new MutationObserver(this._decorateHeaders.bind(this));
            this._tripHeaderObserver.observe(this.getDomRef(), { childList: true, subtree: true });
            this._decorateHeaders();
        },

        onBeforeRendering: function () {
            this._tripHeaderObserver?.disconnect();
            VBox.prototype.onBeforeRendering?.apply(this, arguments);
        },

        exit: function () {
            this._tripHeaderObserver?.disconnect();
            VBox.prototype.exit?.apply(this, arguments);
        },

        _decorateHeaders: function () {
            const controls = this.findAggregatedObjects(true);
            const mdc = controls.find(control => control.isA("sap.ui.mdc.Table"));
            const grid = controls.find(control => control.isA("sap.ui.table.Table"));
            if (!mdc || !grid || mdc.getColumns().length !== grid.getColumns().length) {
                return;
            }
            grid.addStyleClass("tripDataTable");
            const columns = grid.getColumns();
            const entries = mdc.getColumns().map((column, index) => {
                const key = column.getPropertyKey();
                const field = fields.find(name => key === name || key.endsWith("::" + name));
                return { column: columns[index], field: field, header: column.getHeader() };
            });
            const signature = entries.map(entry => entry.column.getId() + ":" + entry.field + ":" + entry.header).join("|");
            if (this._headerSignature !== signature) {
                this._headerSignature = signature;
                entries.forEach((entry, index) => {
                    const column = entry.column;
                    column.destroyMultiLabels();
                    const direction = entry.field?.startsWith("from_") ? "FromWhere"
                        : entry.field?.startsWith("to_") ? "ToWhere" : undefined;
                    const label = new Label({ text: entry.header, wrapping: true, width: "100%" });
                    if (direction) {
                        column.addMultiLabel(new Label({ text: "{i18n>" + direction + "}", textAlign: "Center", width: "100%" }));
                        column.addMultiLabel(label);
                        const prefix = entry.field.split("_")[0] + "_";
                        let span = 1;
                        while (entries[index + span]?.field?.startsWith(prefix)) {
                            span++;
                        }
                        column.setHeaderSpan([span, 1]);
                    } else {
                        label.setTextAlign("Center");
                        label.addStyleClass("tripSingleHeader");
                        column.addMultiLabel(label);
                        column.setHeaderSpan([1, 1]);
                    }
                    label.setRequired(entry.field !== "daily_expense" && !!entry.field && !entry.field.endsWith("_client"));
                });
                return;
            }
            // Keep the working rowspan presentation for the three single headers.
            const root = grid.getDomRef();
            if (!root) {
                return;
            }
            const pairs = Array.from(root.querySelectorAll(".tripSingleHeader"), label => {
                const cell = label.closest("td, th");
                const nextRow = cell?.parentElement.nextElementSibling;
                return { cell: cell, lower: nextRow?.cells[cell.cellIndex] };
            });
            pairs.forEach(({ cell, lower }) => {
                if (cell && lower && cell.rowSpan !== 2) {
                    cell.rowSpan = 2;
                    cell.setAttribute("aria-rowspan", "2");
                    cell.classList.add("tripMergedHeader");
                    // UI5 owns these DOM nodes and must find them on the next
                    // rendering pass (for example when switching Object Page tabs).
                    lower.style.display = "none";
                    lower.setAttribute("aria-hidden", "true");
                }
            });
        }
    });
});
