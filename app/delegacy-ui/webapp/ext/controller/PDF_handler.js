sap.ui.define(["./PDFPreview"], function (PDFPreview) {
    "use strict";
    return {
        handle: function (context) {
            return PDFPreview.open.call(this, context, "Car");
        }
    };
});
