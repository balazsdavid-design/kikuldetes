sap.ui.define([
    "sap/m/Dialog", "sap/m/PDFViewer", "sap/m/Button", "sap/m/MessageToast",
    "sap/m/MessageBox", "sap/base/security/URLListValidator"
], function (Dialog, PDFViewer, Button, MessageToast, MessageBox, URLListValidator) {
    "use strict";

    URLListValidator.add("blob");

    return {
        open: async function (context, kind) {
            const bundle = await this.getModel("i18n").getResourceBundle();
            const text = (key) => bundle.getText(key);
            MessageToast.show(text("PreparingPDF"));
            let objectUrl;
            let dialog;
            try {
                const posting = context.getObject();
                const serviceUrl = this.getModel().getServiceUrl();
                const response = await fetch(serviceUrl + "getPDF" + kind + "?ID=" + encodeURIComponent(posting.ID));
                if (!response.ok) {
                    throw new Error("BasicError");
                }
                const data = await response.json();
                const value = data && data.value;
                const errors = {
                    FuelPriceNotFound: "FuelPriceError", NoVolume: "NoVolumeError",
                    DateError: "DateError", EmployeeDataMissing: "EmployeeDataMissing"
                };
                if (typeof value === "string" && errors[value]) {
                    throw new Error(errors[value]);
                }
                if (Array.isArray(value) && value[0] === "CurrencyNotFound") {
                    MessageBox.error(text("CurrencyError") + " " + (value[1] || ""));
                    return;
                }
                if (typeof value !== "string") {
                    throw new Error("ConversionError");
                }
                let decoded;
                try {
                    decoded = atob(value);
                } catch (_) {
                    throw new Error("ConversionError");
                }
                if (!decoded.startsWith("%PDF-")) {
                    throw new Error("ConversionError");
                }
                const bytes = Uint8Array.from(decoded, character => character.charCodeAt(0));
                objectUrl = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
                const filename = text(kind === "Car" ? "CarPDFFilename" : "RegularPDFFilename") + "_" +
                    (posting.goal || posting.ID).replace(/[\\/:*?"<>|]/g, "_") + ".pdf";
                dialog = new Dialog({
                    title: text("PreviewPDF"),
                    contentWidth: "85vw",
                    contentHeight: "80vh",
                    resizable: true,
                    draggable: true,
                    horizontalScrolling: false,
                    verticalScrolling: false,
                    content: new PDFViewer({
                        source: objectUrl,
                        title: filename,
                        width: "100%",
                        height: "100%",
                        isTrustedSource: true,
                        displayType: "Embedded",
                        showDownloadButton: false,
                        errorPlaceholderMessage: text("PDFPreviewUnavailable")
                    }),
                    beginButton: new Button({
                        text: text("DownloadPDF"),
                        icon: "sap-icon://download",
                        type: "Emphasized",
                        press: function () {
                            const link = document.createElement("a");
                            link.href = objectUrl;
                            link.download = filename;
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                        }
                    }),
                    endButton: new Button({ text: text("ClosePreview"), press: () => dialog.close() }),
                    afterClose: function () {
                        dialog.destroy();
                    }
                });
                // The view also owns the dialog when navigation destroys the page.
                // Release the blob in both the close and owner-destruction paths.
                const destroy = dialog.destroy;
                dialog.destroy = function () {
                    URL.revokeObjectURL(objectUrl);
                    return destroy.apply(this, arguments);
                };
                this.addDependent(dialog);
                dialog.open();
            } catch (error) {
                if (dialog) {
                    dialog.destroy();
                } else if (objectUrl) {
                    URL.revokeObjectURL(objectUrl);
                }
                const key = ["BasicError", "ConversionError", "FuelPriceError", "NoVolumeError", "DateError", "EmployeeDataMissing"].includes(error.message)
                    ? error.message : "BasicError";
                MessageBox.error(text(key));
            }
        }
    };
});
