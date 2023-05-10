sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/m/library",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (BaseController, JSONModel, formatter, mobileLibrary, MessageToast, MessageBox) {
    "use strict";

    // shortcut for sap.m.URLHelper
    var URLHelper = mobileLibrary.URLHelper;

    return BaseController.extend("project1.controller.Chart", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        onInit: function () {
            // Model used to manipulate control states. The chosen values make sure,
            // detail page is busy indication immediately so there is no break in
            // between the busy indication for loading the view's meta data
            var oViewModel = new JSONModel({
                busy : false,
                delay : 0,
                lineItemListTitle : this.getResourceBundle().getText("detailLineItemTableHeading"),
                ChartData : [
                    {
                        name : "Lee",
                        amount : 10000,
                        count : 100
                    },
                    {
                        name : "Kim",
                        amount : 10500,
                        count : 90
                    },
                    {
                        name : "Hwang",
                        amount : 9000,
                        count : 120
                    },
                    {
                        name : "Sung",
                        amount : 16000,
                        count : 210
                    },
                    {
                        name : "Yoo",
                        amount : 2300,
                        count : 40
                    }
                ]
            });

            this.getRouter().getRoute("chart").attachPatternMatched(this._onObjectMatched, this);

            this.setModel(oViewModel, "detailView");

        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        /**
         * Event handler when the share by E-Mail button has been clicked
         * @public
         */
        onSendEmailPress: function () {
            var oViewModel = this.getModel("detailView");

            URLHelper.triggerEmail(
                null,
                oViewModel.getProperty("/shareSendEmailSubject"),
                oViewModel.getProperty("/shareSendEmailMessage")
            );
        },

        /* =========================================================== */
        /* begin: internal methods                                     */
        /* =========================================================== */

        /**
         * Binds the view to the object path and expands the aggregated line items.
         * @function
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
         * @private
         */
        _onObjectMatched: function (oEvent) {
            
            this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");

            
        },

        
    });

});