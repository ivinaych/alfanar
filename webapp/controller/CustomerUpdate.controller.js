sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
    "use strict";

    return Controller.extend("com.exa.alfanar.controller.CustomerUpdate", {
        onInit: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("CustomerUpdate").attachPatternMatched(this._onObjectMatched, this);
        },

        // _onObjectMatched: function(oEvent) {
        //     var sCustomerId = oEvent.getParameter("arguments").customerId;
        //     var sRequestId = oEvent.getParameter("arguments").requestId;

        //     var oModel = this.getView().getModel("customerData");
        //     var aCustomers = oModel.getProperty("/customers");

        //     var oSelectedCustomer = aCustomers.find(customer => customer.customerId === sCustomerId && customer.requestId === sRequestId);

        //     if (oSelectedCustomer) {
        //         oModel.setProperty("/selectedCustomer", oSelectedCustomer);
        //         this.getView().setBindingContext(oModel.createBindingContext("/selectedCustomer"));
        //     }
        // },
        _onObjectMatched: function(oEvent) {
            var sCustomerId = oEvent.getParameter("arguments").customerId;
            var sRequestId = oEvent.getParameter("arguments").requestId;
        
            console.log("Navigated with Customer ID:", sCustomerId, "Request ID:", sRequestId);
        
            var oModel = this.getView().getModel("customerData");
        
            if (!oModel) {
                console.error("Model 'customerData' is not available!");
                return;
            }
        
            // If a new customer is being added, set an empty object
            if (sCustomerId === "new" && sRequestId === "new") {
                var oNewCustomer = {
                    customerId: "",
                    requestId: "",
                    customerNameEn: "",
                    mobileNo: "",
                    countryCode: "",
                    city: "",
                    salesOrg: ""
                };
        
                oModel.setProperty("/selectedCustomer", oNewCustomer);
            } else {
                // Find the existing customer
                var aCustomers = oModel.getProperty("/customers");
                var oSelectedCustomer = aCustomers.find(customer => 
                    customer.customerId === sCustomerId && customer.requestId === sRequestId
                );
        
                if (oSelectedCustomer) {
                    oModel.setProperty("/selectedCustomer", oSelectedCustomer);
                } else {
                    console.warn("Customer not found in model.");
                }
            }
        
            // Bind the selected or empty customer to the view
            this.getView().setBindingContext(oModel.createBindingContext("/selectedCustomer"));
        },        

        onSaveCustomer: function() {
            sap.m.MessageToast.show("Customer details saved successfully!");
        }
    });
});
