sap.ui.define([
    "sap/m/Select", "sap/m/SelectRenderer", "sap/ui/core/Item", "sap/m/MessageBox"
], function (Select, SelectRenderer, Item, MessageBox) {
    "use strict";

    return Select.extend("delegacy-ui.ext.control.PerDiemSelect", {
        metadata: {
            properties: {
                amount: { type: "string", defaultValue: null },
                currency: { type: "string", defaultValue: null },
                amountProperty: { type: "string", defaultValue: "daily_price" },
                currencyProperty: { type: "string", defaultValue: "currency_code" },
                integerAmount: { type: "boolean", defaultValue: false }
            }
        },
        renderer: SelectRenderer,

        init: function () {
            Select.prototype.init.apply(this, arguments);
            this.setForceSelection(false);
            this.setRequired(true);
            this._createRateItems();
            this.attachChange(this._onRateChange, this);
        },

        _createRateItems: function () {
            this.addItem(new Item({ key: "", text: "{i18n>SelectPerDiem}" }));
            this.addItem(new Item({ key: "5000", text: "{i18n>DomesticPerDiem}" }));
            this.addItem(new Item({ key: "12500", text: "{i18n>ForeignPerDiem}" }));
        },

        clone: function () {
            const clone = Select.prototype.clone.apply(this, arguments);
            // UI5 copies the source items after init has already created the defaults.
            // Rebuild this control's options once, including the cloned row's legacy rate.
            clone.destroyItems();
            clone._legacyItem = null;
            clone._createRateItems();
            clone._syncSelection();
            return clone;
        },

        setAmount: function (amount) {
            this.setProperty("amount", amount == null ? null : String(amount));
            this._syncSelection();
            return this;
        },

        setCurrency: function (currency) {
            this.setProperty("currency", currency);
            this._syncSelection();
            return this;
        },

        _syncSelection: function () {
            if (this._legacyItem) {
                this.removeItem(this._legacyItem);
                this._legacyItem.destroy();
                this._legacyItem = null;
            }
            const amount = this.getAmount();
            const key = amount === null || amount === "" ? "" : String(Number(amount));
            if (key && (!["5000", "12500"].includes(key) || this.getCurrency() !== "HUF")) {
                // Existing expenses keep their actual amount/currency until a new rate is chosen.
                this._legacyItem = new Item({ key: "existing", text: key + " " + (this.getCurrency() || "") });
                this.addItem(this._legacyItem);
                this.setSelectedKey("existing");
            } else {
                this.setSelectedKey(key);
            }
        },

        _onRateChange: async function () {
            const key = this.getSelectedKey();
            if (key === "existing") {
                return;
            }
            const context = this.getBindingContext();
            try {
                const amount = key ? (this.getIntegerAmount() ? Number(key) : key) : null;
                const updates = [context.setProperty(this.getAmountProperty(), amount)];
                // Car trip rows are always HUF and have no currency property.
                if (this.getCurrencyProperty()) {
                    updates.push(context.setProperty(this.getCurrencyProperty(), "HUF"));
                }
                await Promise.all(updates);
            } catch (_) {
                this._syncSelection();
                const bundle = await this.getModel("i18n").getResourceBundle();
                MessageBox.error(bundle.getText("PerDiemUpdateError"));
            }
        }
    });
});
