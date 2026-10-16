sap.ui.define(["./PDFPreview"], function (PDFPreview) {
    "use strict";
    return {
        downloadPDF: function (context) {
            return PDFPreview.open.call(this, context, "Regular");
        }
    };
});
