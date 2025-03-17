sap.ui.define([
    "sap/ui/core/UIComponent",
    "com/exa/alfanar/model/models",
    "sap/ui/model/json/JSONModel"
], (UIComponent, models, JSONModel) => {
    "use strict";

    return UIComponent.extend("com.exa.alfanar.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");
            var oCustomerModel = new JSONModel("model/CustomerData.json");
            this.setModel(oCustomerModel, "customerData");

            // enable routing
            this.getRouter().initialize();
        }
    });
});