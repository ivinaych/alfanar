sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageToast"
  ], function (Controller, UIComponent, MessageToast) {
    "use strict";
  
    return Controller.extend("com.exa.alfanar.controller.App", {
        onInit: function () {
            this._router = UIComponent.getRouterFor(this);
            var aRoutes = ["Dashboard", "IN", "CC", "QT", "OR", "LF", "F2", "TrackOrder", "Help", "Settings"];
            aRoutes.forEach(route => this._router.getRoute(route).attachPatternMatched(this._onRouteMatched, this));
  
            // Default route to Dashboard on app start
            this._router.navTo("Dashboard");
        },
  
        _onRouteMatched: function(oEvent) {
            var sRouteName = oEvent.getParameter("name");
            this._updateSelectedNavItem(sRouteName);
        },
  
        _updateSelectedNavItem: function(sKey) {
            this._removeSelectionFromAllItems();
           
            var sideNavItems = this.getView().byId("sideNav").getItems();
            if (sideNavItems) {
                sideNavItems.forEach(item => {
                    if (item.getMetadata && 
                        item.getMetadata().getName() === "com.exa.alfanar.controls.VBox" &&
                        item.getProperty("key") === sKey) {
                        item.addStyleClass("selected");
                    }
                });
            }
        },
  
        onSideNavItemSelection: function (oEvent) {
            // Get the selected key from the custom control
            var oSource = oEvent.getSource();
            var sKey = oSource.getProperty("key");
  
            // Navigate to the corresponding route
            this._router.navTo(sKey);
        },
  
        _removeSelectionFromAllItems: function() {
            var sideNavItems = this.getView().byId("sideNav").getItems();
            if (sideNavItems) {
                sideNavItems.forEach(item => {
                    if (item.getMetadata && 
                        item.getMetadata().getName() === "com.exa.alfanar.controls.VBox") {
                        item.removeStyleClass("selected");
                    }
                });
            }
        }
    });
  });
  