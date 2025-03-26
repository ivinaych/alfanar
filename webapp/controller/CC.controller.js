sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("com.exa.alfanar.controller.CC", {
        onInit: function () {
            this.getOwnerComponent().getRouter().getRoute("CustomerUpdate").attachPatternMatched(this._onDetailMatched, this);
              // Load tab status data (this would be fetched from backend)
              var oTabStatusModel = new JSONModel("model/TabStatusData.json");
              this.getView().setModel(oTabStatusModel, "tabStatusModel");
  
              // Set initial binding context for IconTabBar
              var oIconTabHeader = this.byId("statusTabHeader");
              oIconTabHeader.bindAggregation("items", {
                  path: "tabStatusModel>/tabStatuses",
                  template: new sap.m.IconTabFilter({
                      key: "{tabStatusModel>key}",
                      text: "{tabStatusModel>text}",
                      count: "{tabStatusModel>count}"
                  })
              });
        },

        onEditCustomer: function (oEvent) {
            // Get the selected row context
            var oItem = oEvent.getSource().getParent();
            var oCtx = oItem.getBindingContext("CustomerData");

            // Store customer data in a global model to pass it to the CustomerUpdate view
            var oCustomerData = oCtx.getObject();
            var oModel = this.getView().getModel("CustomerData");
            oModel.setProperty("/selectedCustomer", oCustomerData);

            // Navigate to CustomerUpdate page with customerId as parameter
            this.getOwnerComponent().getRouter().navTo("CustomerUpdate", {
                customerId: oCustomerData.customerId
            });
        },

        onAddCustomer: function () {
            var oModel = this.getView().getModel("CustomerData");
        
            // Create an empty object with necessary fields
            var oNewCustomer = {
                customerId: "",
                customerAccountGroup: "",
                requestId: "",
                customerNameEn: "",
                countryCode: "",
                mobileNo: "",
                postalCode: "",
                city: "",
                salesOrg: "",
                Distributionchannel: "",
                Division: "",
                SalesOffice: "",
                lastupdate: ""
            };
        
            // Set empty customer data in model
            oModel.setProperty("/selectedCustomer", oNewCustomer);
        
            // Navigate to the detail page without a parameter
            this.getOwnerComponent().getRouter().navTo("CustomerAdd"); // Navigate to empty form
        },
    });
});
