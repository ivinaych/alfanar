sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel"
], function(Controller, UIComponent, JSONModel) {
    "use strict";

    return Controller.extend("com.exa.alfanar.controller.ListPage", {
        onInit: function() {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.getRoute("ListPage").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function(oEvent) {
            var sModule = oEvent.getParameter("arguments").module;

            var oPageData = this._getModuleConfig(sModule);
            var oModel = new JSONModel(oPageData);
            this.getView().setModel(oModel, "viewModel");

            this._buildIconTabBar(oPageData.filters);
            this._buildTable(oPageData.columns);
        },

        _getModuleConfig: function(sModule) {
            var oConfig = {
                "IN": {
                    pageTitle: "Enquiry List",
                    Buttontext: "Create Enquiry",
                    filters: [
                        { key: "Open", text: "Open Enquiries" },
                        { key: "Closed", text: "Closed Enquiries" }
                    ],
                    columns: [
                        { label: "Enquiry ID", key: "enquiryID" },
                        { label: "Customer Name", key: "customerName" }
                    ]
                },
                "QT": {
                    pageTitle: "Quotation List",
                    Buttontext: "Create Quotation",
                    filters: [
                        { key: "Draft", text: "Draft Quotations" },
                        { key: "Approved", text: "Approved Quotations" }
                    ],
                    columns: [
                        { label: "Quotation ID", key: "quotationID" },
                        { label: "Amount", key: "amount" }
                    ]
                },
                "OR": {
                    pageTitle: "Sales Order List",
                    Buttontext: "Create SalesOrder",
                    filters: [
                        { key: "New", text: "New Orders" },
                        { key: "Completed", text: "Completed Orders" }
                    ],
                    columns: [
                        { label: "Order ID", key: "orderID" },
                        { label: "Order Date", key: "orderDate" }
                    ]
                },
                "LF": {
                    pageTitle: "Delivery List",
                    Buttontext: "Create Delivery",
                    filters: [
                        { key: "Pending", text: "Pending Deliveries" },
                        { key: "Shipped", text: "Shipped Deliveries" }
                    ],
                    columns: [
                        { label: "Delivery ID", key: "deliveryID" },
                        { label: "Status", key: "status" }
                    ]
                }
            };
            return oConfig[sModule];
        },

        _buildIconTabBar: function(aFilters) {
            var oTabBar = this.getView().byId("iconTabBar");
            oTabBar.removeAllItems();

            aFilters.forEach(filter => {
                oTabBar.addItem(new sap.m.IconTabFilter({
                    key: filter.key,
                    text: filter.text
                }));
            });
        },

        _buildTable: function(aColumns) {
            var oTable = this.getView().byId("listTable");
            oTable.destroyColumns();
            oTable.destroyItems();

            aColumns.forEach(col => {
                oTable.addColumn(new sap.m.Column({
                    header: new sap.m.Text({ text: col.label })
                }));
            });

            var oItemTemplate = new sap.m.ColumnListItem({
                cells: aColumns.map(col => new sap.m.Text({ text: "{" + col.key + "}" }))
            });

            var oModel = new JSONModel({ items: [] }); // Replace with real data later
            this.getView().setModel(oModel, "listModel");

            oTable.bindItems({
                path: "listModel>/items",
                template: oItemTemplate
            });
        },

        onTabSelect: function(oEvent) {
            var sSelectedKey = oEvent.getParameter("key");
            console.log("Tab selected:", sSelectedKey);
            // Implement filtering logic
        },

        onCreate: function() {
            sap.m.MessageToast.show("Create button clicked!");
        }
    });
});
