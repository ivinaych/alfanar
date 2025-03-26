sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("com.exa.alfanar.controller.CustomerUpdate", {

        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("CustomerUpdate").attachPatternMatched(this._onDetailMatched, this);
            oRouter.getRoute("CustomerAdd").attachPatternMatched(this._onAddCustomerMatched, this);
        },

        // Load existing customer data for editing
        _onDetailMatched: function (oEvent) {
            var oModel = this.getView().getModel("CustomerData");
            var customerId = oEvent.getParameter("arguments").customerId;

            if (customerId) {
                var aCustomers = oModel.getProperty("/customers");
                var oCustomer = aCustomers.find(customer => customer.customerId === customerId);
                if (oCustomer) {
                    oModel.setProperty("/selectedCustomer", JSON.parse(JSON.stringify(oCustomer))); // Deep copy
                    
                    // Ensure visibility settings
                    this._updateFormVisibility(oCustomer.customerAccountGroup);
                }
            }
        },

        // Clear fields for new customer creation
        _onAddCustomerMatched: function () {
            var oModel = this.getView().getModel("CustomerData");
            var oNewCustomer = {
                customerId: "",
                customerType: "",  // Reset Customer Type
                customerAccountGroup: "",  // Reset Customer Account Group
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
            
            oModel.setProperty("/selectedCustomer", oNewCustomer);
            
            // Reset visibility settings
            this._updateFormVisibility("");
        },
        

        // Update visibility based on Customer Account Group
        _updateFormVisibility: function (sAccountGroup) {
            var oView = this.getView();
            var bIsB2B = sAccountGroup === "B2B";
            var bIsB2C = sAccountGroup === "B2C";

            oView.byId("attachmentContainer").setVisible(bIsB2B);
            oView.byId("b2cForm").setVisible(bIsB2C);
        },

        // Handle change in Customer Account Group
        onAccountGroupChange: function (oEvent) {
            var sSelectedKey = oEvent.getParameter("selectedItem").getKey();
            this._updateFormVisibility(sSelectedKey);
        },

        onNavBack: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("CC", {}, true);
        },

        onSaveCustomer: function () {
            var oModel = this.getView().getModel("CustomerData");
            var aCustomers = oModel.getProperty("/customers");
            var oSelectedCustomer = oModel.getProperty("/selectedCustomer");

            if (!oSelectedCustomer.customerNameEn || !oSelectedCustomer.mobileNo) {
                MessageToast.show("Customer Name and Mobile No. are required!");
                return;
            }

            if (oSelectedCustomer.customerId) {
                // Editing existing customer
                var iIndex = aCustomers.findIndex(customer => customer.customerId === oSelectedCustomer.customerId);
                if (iIndex !== -1) {
                    aCustomers[iIndex] = oSelectedCustomer;
                }
            } else {
                // Adding new customer
                oSelectedCustomer.customerId = "CUST" + (aCustomers.length + 1).toString().padStart(4, '0');
                aCustomers.push(oSelectedCustomer);
            }

            oModel.setProperty("/customers", aCustomers);
            MessageToast.show("Customer saved successfully!");

            this.getOwnerComponent().getRouter().navTo("CC");
        },

        onCancel: function () {
            this.getOwnerComponent().getRouter().navTo("CC");
        }
    });
});
