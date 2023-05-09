sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/m/library"
], function (BaseController, JSONModel, formatter, mobileLibrary) {
    "use strict";

    // shortcut for sap.m.URLHelper
    var URLHelper = mobileLibrary.URLHelper;

    return BaseController.extend("project1.controller.DetailCreate", {

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
                buyer : null,
                amount : null,
                currency : null,
                currList : [
                    { code : "KRW", text : "원화" },
                    { code : "EUR", text : "유로화" },
                    { code : "USD", text : "달러" },
                ],
                itemData: [
                    {
                        itemno: null,
                        itemname: null,
                        itemcode: null,
                        quantity: null
                    }
                ]
            });

            this.getRouter().getRoute("objectCreate").attachPatternMatched(this._onObjectMatched, this);

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

        onAddItem : function () {
            var oModel = this.getView().getModel("detailView");
            var oRow = {
                itemno: null,
                itemname: null,
                itemcode: null,
                quantity: null
            };

            var oData = oModel.getProperty("/itemData");
            oData.push({
                itemno: null,
                itemname: null,
                itemcode: null,
                quantity: null
            });
            oModel.setProperty("/itemData", oData);
        }
    });

});