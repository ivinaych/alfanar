sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/UIComponent",
  "sap/m/MessageToast"
], function (Controller, UIComponent, MessageToast) {
  "use strict";

  return Controller.extend("com.exa.alfanar.controller.App", {
      onInit: function () {
          // Get the router
          this._router = UIComponent.getRouterFor(this);
          
          // Register for routeMatched events to update the selected navigation item
          this._router.getRoute("Dashboard").attachPatternMatched(this._onRouteMatched, this);
          this._router.getRoute("IN").attachPatternMatched(this._onRouteMatched, this);
          this._router.getRoute("CC").attachPatternMatched(this._onRouteMatched, this);
          this._router.getRoute("QT").attachPatternMatched(this._onRouteMatched, this);
          this._router.getRoute("OR").attachPatternMatched(this._onRouteMatched, this);
          this._router.getRoute("LF").attachPatternMatched(this._onRouteMatched, this);
          this._router.getRoute("F2").attachPatternMatched(this._onRouteMatched, this);
          this._router.getRoute("TrackOrder").attachPatternMatched(this._onRouteMatched, this);
          this._router.getRoute("Help").attachPatternMatched(this._onRouteMatched, this);
          this._router.getRoute("Settings").attachPatternMatched(this._onRouteMatched, this);
          
          // Default route to Dashboard on app start
          this._router.navTo("Dashboard");
      },
      
      _onRouteMatched: function(oEvent) {
          var sRouteName = oEvent.getParameter("name");
          this._updateSelectedNavItem(sRouteName);
      },
      
      _updateSelectedNavItem: function(sKey) {
          // Remove selected class from all items
          this._removeSelectionFromAllItems();
          
          // Find the nav item with the matching key and select it
          var sideNavItems = this.getView().byId("sideNav").getItems();
          if (sideNavItems) {
              for (var i = 0; i < sideNavItems.length; i++) {
                  var item = sideNavItems[i];
                  if (item.getMetadata && 
                      item.getMetadata().getName() === "com.exa.alfanar.controls.VBox" &&
                      item.getProperty("key") === sKey) {
                      item.addStyleClass("selected");
                      break;
                  }
              }
          }
          
          // Also check in the bottom nav items
          var bottomNavContainer = this.byId("sideNavBottom");
          if (bottomNavContainer) {
              var bottomItems = bottomNavContainer.getItems();
              if (bottomItems) {
                  for (var j = 0; j < bottomItems.length; j++) {
                      var bottomItem = bottomItems[j];
                      if (bottomItem.getMetadata && 
                          bottomItem.getMetadata().getName() === "com.exa.alfanar.controls.VBox" &&
                          bottomItem.getProperty("key") === sKey) {
                          bottomItem.addStyleClass("selected");
                          break;
                      }
                  }
              }
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
          // First handle top items
          var sideNavItems = this.getView().byId("sideNav").getItems();
          if (sideNavItems) {
              for (var i = 0; i < sideNavItems.length; i++) {
                  var item = sideNavItems[i];
                  if (item.getMetadata && 
                      item.getMetadata().getName() === "com.exa.alfanar.controls.VBox") {
                      item.removeStyleClass("selected");
                  }
              }
          }
          
          // Then handle bottom items
          var bottomNavContainer = this.byId("sideNavBottom");
          if (bottomNavContainer) {
              var bottomItems = bottomNavContainer.getItems();
              if (bottomItems) {
                  for (var j = 0; j < bottomItems.length; j++) {
                      var bottomItem = bottomItems[j];
                      if (bottomItem.getMetadata && 
                          bottomItem.getMetadata().getName() === "com.exa.alfanar.controls.VBox") {
                          bottomItem.removeStyleClass("selected");
                      }
                  }
              }
          }
      }
  });
});