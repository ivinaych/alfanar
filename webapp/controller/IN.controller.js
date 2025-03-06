sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("com.exa.alfanar.controller.IN", {
        onInit: function () {
            // Initialize the Enquiry view
            var oViewModel = new JSONModel({
                busy: false,
                delay: 0
            });
            this.getView().setModel(oViewModel, "viewModel");
            
            // Load mock data for demonstration
            this._loadMockData();
        },
        
        _loadMockData: function() {
            // Create sample enquiry data
            var oModel = new JSONModel({
                Enquiries: [
                    {
                        EnquiryId: "ENQ001",
                        CreatedDate: new Date(2025, 2, 1), // March 1, 2025
                        CustomerName: "ABC Corporation",
                        ProductCategory: "Electrical Equipment",
                        Status: "NEW"
                    },
                    {
                        EnquiryId: "ENQ002",
                        CreatedDate: new Date(2025, 2, 2), // March 2, 2025
                        CustomerName: "XYZ Industries",
                        ProductCategory: "Lighting Solutions",
                        Status: "INPROCESS"
                    },
                    {
                        EnquiryId: "ENQ003",
                        CreatedDate: new Date(2025, 2, 3), // March 3, 2025
                        CustomerName: "Global Tech",
                        ProductCategory: "Power Distribution",
                        Status: "COMPLETED"
                    },
                    {
                        EnquiryId: "ENQ004",
                        CreatedDate: new Date(2025, 2, 4), // March 4, 2025
                        CustomerName: "Modern Solutions Ltd",
                        ProductCategory: "Automation Systems",
                        Status: "NEW"
                    },
                    {
                        EnquiryId: "ENQ005",
                        CreatedDate: new Date(2025, 2, 5), // March 5, 2025
                        CustomerName: "Eastern Electric Co",
                        ProductCategory: "Cable Management",
                        Status: "INPROCESS"
                    }
                ]
            });
            
            this.getView().setModel(oModel);
        },
        
        formatter: {
            formatDate: function(date) {
                if (!date) {
                    return "";
                }
                
                var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: "MMM dd, yyyy"
                });
                
                return oDateFormat.format(date);
            },
            
            formatStatusState: function(status) {
                switch (status) {
                    case "NEW":
                        return "Information";
                    case "INPROCESS":
                        return "Warning";
                    case "COMPLETED":
                        return "Success";
                    default:
                        return "None";
                }
            }
        },
        
        onCreateEnquiry: function() {
            MessageToast.show("Create New Enquiry functionality would open a dialog or navigate to creation form");
        },
        
        onApplyFilters: function() {
            // Implementation for filtering would go here
            MessageToast.show("Filters applied");
        },
        
        onResetFilters: function() {
            // Reset filter fields
            this.byId("filterEnquiryId").setValue("");
            this.byId("filterDateRange").setValue("");
            this.byId("filterStatus").setSelectedKey("");
            
            MessageToast.show("Filters reset");
        },
        
        onEnquiryItemPress: function(oEvent) {
            var oItem = oEvent.getSource();
            var oContext = oItem.getBindingContext();
            var sEnquiryId = oContext.getProperty("EnquiryId");
            
            MessageToast.show("Navigate to detail view for Enquiry: " + sEnquiryId);
            // Navigation implementation would go here
        },
        
        onEditEnquiry: function(oEvent) {
            var oButton = oEvent.getSource();
            var oContext = oButton.getBindingContext();
            var sEnquiryId = oContext.getProperty("EnquiryId");
            
            MessageToast.show("Edit Enquiry: " + sEnquiryId);
        },
        
        onViewAttachments: function(oEvent) {
            var oButton = oEvent.getSource();
            var oContext = oButton.getBindingContext();
            var sEnquiryId = oContext.getProperty("EnquiryId");
            
            MessageToast.show("View Attachments for Enquiry: " + sEnquiryId);
        },
        
        onDeleteEnquiry: function(oEvent) {
            var oButton = oEvent.getSource();
            var oContext = oButton.getBindingContext();
            var sEnquiryId = oContext.getProperty("EnquiryId");
            
            MessageBox.confirm("Are you sure you want to delete Enquiry " + sEnquiryId + "?", {
                title: "Confirm Deletion",
                onClose: function(oAction) {
                    if (oAction === MessageBox.Action.OK) {
                        // Delete implementation would go here
                        MessageToast.show("Enquiry " + sEnquiryId + " deleted");
                    }
                }
            });
        }
    });
});