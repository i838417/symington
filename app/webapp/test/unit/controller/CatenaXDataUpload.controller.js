/*global QUnit*/

sap.ui.define([
	"comsapcatenaxdataupload/catenaxdataupload/controller/CatenaXDataUpload.controller"
], function (Controller) {
	"use strict";

	QUnit.module("CatenaXDataUpload Controller");

	QUnit.test("I should test the CatenaXDataUpload controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
