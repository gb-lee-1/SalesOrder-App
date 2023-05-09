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
                        Itemno: null,
                        Itemname: null,
                        Itemcode: null,
                        Quantity: null
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

            var oModel = this.getView().getModel("detailView");
            oModel.setProperty("/buyer", null);
            oModel.setProperty("/amount", null);
            oModel.setProperty("/currency", null);
            oModel.setProperty("/itemData", [
            {
                Itemno: null,
                Itemname: null,
                Itemcode: null,
                Quantity: null
            }]);
            
        },

        onAddItem : function () {
            var oModel = this.getView().getModel("detailView");
            var oRow = {
                Itemno: null,
                Itemname: null,
                Itemcode: null,
                Quantity: null
            };

            var oData = oModel.getProperty("/itemData");
            oData.push(oRow);
            oModel.setProperty("/itemData", oData);
        },

        onPost : function() {

            var oInputBuyer = this.byId("inputBuyer"),
                oInputAmount = this.byId("inputAmount"),
                oComboBox = this.byId("combo");

            var sValue1 = oInputBuyer.getValue(),
                sValue2 = oInputAmount.getValue(),
                sKey = oComboBox.getSelectedKey();

            if (!sValue1) {
                oInputBuyer.setValueState("Error");
                oInputBuyer.setValueStateText("구매자는 필수 입력입니다")
            } else {
                oInputBuyer.setValueState();
            }

            if (!sValue2) {
                oInputAmount.setValueState("Error");
                oInputAmount.setValueStateText("구매자는 필수 입력입니다")
            } else {
                oInputAmount.setValueState();
            }

            if (!sKey) {
                oComboBox.setValueState("Error");
                oComboBox.setValueStateText("구매자는 필수 입력입니다")
            } else {
                oComboBox.setValueState();
            }

            // 필수값이 다 들어있을 경우
            if( sValue1 && sValue2 && sKey ) {
                var oModel = this.getView().getModel("detailView"),
                    oData = oModel.getData();
                var oODataModel = this.getView().getModel();

                // post 요청 내용 - deep insert 
                var oReqest = {
                    Buyer : oData.buyer,
                    Amount : oData.amount,
                    Currency : oData.currency,
                    ToSalesOrderItem : oData.itemData
                }

                return;
                oODataModel.create("/SalesOrderSet", oReqest, {
                    sucess : function(){
                        MessageToast.show("저장 완료")
                    },
                    error : function(){
                        MessageToast.show("저장 실패")
                    }
                });
            } else {
                // MessageToast.show("필수값을 입력하세요!")
                MessageBox.error("필수값을 입력하세요!")
            }
            

            
            // oODataModel.submitChanges(
            //     {
            //         sucess : function(){
            //             MessageToast.show("저장 완료")
            //         },
            //         error : function(){
            //             MessageToast.show("저장 실패")
            //         }
            //     })
        }
    });

});