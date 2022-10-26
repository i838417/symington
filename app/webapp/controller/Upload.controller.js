sap.ui.define([
    "./BaseController",
    "sap/ui/core/util/File",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "myapp/utils/APIHelper"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, File, MessageBox, MessageToast, APIHelper) {
        "use strict";

        return BaseController.extend("myapp.controller.Upload", {
            onInit: async function()
            {
                let sCompanyName = await APIHelper.getCompanyName().ResultData;
                this.getView().byId("product").setVisible((sCompanyName == "Amorim" || sCompanyName == "BA Glass") ? false : true );
            },

            onPressUpload: async function(event)
            {
                if (! this.validateUploadFilename())
                {
                    return;
                }
                let fileUploader = this.getView().byId("fileUploader");
                let sProduct = this.getView().byId("product").getSelectedItem().getText();
                let sCompanyName = await APIHelper.getCompanyName().ResultData;

                let confirmMsg = this.getResourceBundle().getText("upload.Msg.ConfirmUpload");
                MessageBox.confirm(confirmMsg,
                {
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
                    onClose: function(action)
                    {
                        if (action == sap.m.MessageBox.Action.YES)
                        {
                            let uploadUrl = "/srv/upload";
                            if(sCompanyName === "Symington")
                            {
                                uploadUrl = uploadUrl + "?product="+sProduct;
                            }
                            
                            fileUploader.setSendXHR(true);
                            fileUploader.setUploadUrl(uploadUrl);
                            fileUploader.upload();
                        }
                        fileUploader.clear();
                    }
                });
            },

            onUploadComplete: function(event)
            {
                let responseStatus = event.getParameter("status");
                let responseRaw = event.getParameter("responseRaw");
                if (responseStatus === 200)
                {
                    let msg = this.getResourceBundle().getText("upload.Msg.Upload.Successful");
                    MessageToast.show(msg);
                    let fileUploader = this.getView().byId("fileUploader");
                    fileUploader.clear();
                }
                else
                {
                    MessageBox.error(responseRaw);
                }
            },

            validateUploadFilename: function()
            {
                let fileUploader = this.getView().byId("fileUploader");
                let fileName = fileUploader.getValue();
                if (fileName == null || fileName === "" || (! fileName.endsWith(".xlsx") && ! fileName.endsWith(".csv")))
                {
                    let errMsgg = this.getResourceBundle().getText("upload.ErrorMsg.IncorrectFileType");
                    MessageBox.error(errMsgg);
                    return false;
                }
                return true;
            },

            onPressDownloadExcel: function(event)
            {
                let httpRequest = new XMLHttpRequest();
                httpRequest.responseType = "arraybuffer";
                httpRequest.open("GET", "/srv/download_xlsx", true);
                httpRequest.send();
                httpRequest.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200)
                    {
                    //  console.log(this.response);
                        File.save(this.response, "CatenaX_Template", "xlsx", null, null);
                    }
                };
            },

            onPressDownloadCsv: function(event)
            {
                let httpRequest = new XMLHttpRequest();
                httpRequest.responseType = "arraybuffer";
                httpRequest.open("GET", "/srv/download_csv", true);
                httpRequest.send();
                httpRequest.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200)
                    {
                    //  console.log(this.response);
                        File.save(this.response, "CatenaX_Template", "csv", null, null);
                    }
                };
            }
        });
    });
