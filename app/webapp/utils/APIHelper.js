sap.ui.define(
    [],

    function () {
        "use strict";

        return {
            requestHeader: function () {
                var contentType = "application/json";
                var reqHeader = { "Content-Type": contentType };
                return reqHeader;
            },

            //	==================== APIs ====================
            getUserInfo: function () {
                var reqPath = "srv/user";
                var dataModel = new sap.ui.model.json.JSONModel();
                var reqHeader = this.requestHeader();
                dataModel.loadData(reqPath, "", false, "GET", false, null, reqHeader);

                var dataDO = dataModel.getData();
                return dataDO;
            },

            getCompanyName: function () {
                var reqPath = "srv/company";
                var dataModel = new sap.ui.model.json.JSONModel();
                var reqHeader = this.requestHeader();
                dataModel.loadData(reqPath, "", false, "GET", false, null, reqHeader);

                var dataDO = dataModel.getData();
                return dataDO;
            },

        }
    }
);