sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        onPress: function(oEvent) {
            MessageToast.show("Custom handler invoked:).");
        },
        onBeforeUploadStart: function (oEvent) {
    const oTable = oEvent.getSource().getParent();
    const oModel = oTable.getModel();
    const oItem = oEvent.getParameter("item");
    const oBinding = oTable.getBinding("items");
    const oFile = oItem.getFileObject();
    const sServiceUrl = 'your service url as in the manifest file';
    oBinding.create({
        "filename": oFile.name,
        "mimeType": oFile.type
    });
    // Trigger the POst request
    oModel.submitBatch("attachmentsGroup");
    oBinding.attachEventOnce("createCompleted", function (oEvent) {
        const oContext = oEvent.getParameter("context");
        const oUploadSetwithTable = oTable.getDependents()[0];
        const oUploader = oUploadSetwithTable.getUploader(); // Retrieve our uploader defined in the XML
        const sUploadUrlUrl = sServiceUrl + oContext.getPath() + '/content';
        oUploader.setUploadUrl(sUploadUrlUrl);
        oUploader.uploadItem(oItem); // Trigger the Put request
        MessageToast.show("Attachments Added");
        // Update the URL property so it points to the content property
        oContext.setProperty("url", sUploadUrlUrl).then(function () {
            oTable.getBindingContext().requestSideEffects([{ $NavigationPropertyPath: "Attachments" }]);
        });
    });
},

        onBeforeUploadInit: function (oEvent) {
            const oUploader = oEvent.getSource().getUploader();
            oUploader.setUploadUrl("");
        },
        
        onSelectionChange: function(oEvent) {
            const oTable = oEvent.getSource();
            const aSelectedItems = oTable?.getSelectedContexts();
            const oDownloadBtn = this.byId("downloadSelectedAttachments");
            const oDeleteBtn = this.byId("deleteSelectedAttachments");
            if (aSelectedItems.length > 0) {
                oDownloadBtn.setEnabled(true);
                oDeleteBtn.setEnabled(true);
            } else {
                oDownloadBtn.setEnabled(false);
                oDeleteBtn.setEnabled(false);
            }
        },
        onDownloadFiles: function(oEvent) {
            const oTable = this.byId("attachmentsTable");
            const oUploadSet = oTable.getDependents()[0];
            const aContexts = oTable.getSelectedContexts();
            aContexts.forEach(oContext => {
                oUploadSet.download(oContext, true);
            });
        },
        onDeleteFiles: function () {
            const oTable = this.byId("attachmentsTable");
            const aContexts = oTable.getSelectedContexts();
            aContexts.forEach(oContext => {
                oContext.delete().then(()=> {
                    MessageToast.show("Attachments Deleted");
                });
            });
        }
    };
});
