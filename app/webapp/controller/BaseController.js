sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function(
	Controller, History
) {
	"use strict";

	return Controller.extend("myapp.controller.BaseController", {
        /**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter : function () {
			return this.getOwnerComponent().getRouter();
		},

		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel : function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel : function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle : function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Event handler for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
		onNavBack : function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				// eslint-disable-next-line sap-no-history-manipulation
				history.go(-1);
			} else {
				this.getRouter().navTo("master", {}, true);
			}
		},

		uiBusyDuration: function()
		{
			let busyDuration = 100;
			return busyDuration;
        },
        
		uiBusyDelay: function()
		{
			let busyDelay = 10;
			return busyDelay;
        },
        
		doBusy: function(fnResolve, self, args)
		{
			let duration = this.uiBusyDuration();
			let delay = this.uiBusyDelay();
			sap.ui.core.BusyIndicator.show(delay);
			let timeout = setTimeout(function()
			{
				if (typeof fnResolve === "function")
				{
					fnResolve(self, args);
				}
				sap.ui.core.BusyIndicator.hide();
				clearTimeout(timeout);
			}, duration);
        }
	});
});