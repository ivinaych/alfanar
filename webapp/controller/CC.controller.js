sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function(Controller, JSONModel, Fragment, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("com.exa.alfanar.controller.CC", {
        onInit: function() {
            // Load tab status data (in real scenario, this would be fetched from backend)
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
            
            // Initialize filter model - this will be populated dynamically from table data
            this._oFilterModel = new JSONModel({
                accountGroups: [],
                countries: [],
                salesOrgs: [],
                distChannels: [],
                divisions: [],
                salesOffices: []
            });
            this.getView().setModel(this._oFilterModel, "filterModel");
            
            // Store the original table data for filtering
            this._originalTableData = null;
            this._activeFilters = {};
            this._searchQuery = "";
            
            // Initialize with default selected tab
            this._currentTabKey = "created";
            
            // Initialize table filters after a short delay to ensure data is loaded
            var that = this;
            setTimeout(function() {
                that._initializeFilterData();
            }, 500);
        },
        
        // Dynamically populate filter data from table
        _initializeFilterData: function() {
            var that = this;
            
            // Get customer data from the model
            var oModel = this.getOwnerComponent().getModel("customerData");
            
            if (!oModel) {
                // If model is not available, try again later
                setTimeout(function() {
                    that._initializeFilterData();
                }, 500);
                return;
            }
            
            // Get the data from the model
            var oData = oModel.getData();
            var aCustomers = oData.customers || [];
            
            // Log data to verify it's loaded properly
            console.log("Retrieved customer data:", aCustomers);
            
            if (aCustomers.length === 0) {
                // If data is empty, try again later
                setTimeout(function() {
                    that._initializeFilterData();
                }, 500);
                return;
            }
            
            // Store original data
            that._originalTableData = JSON.parse(JSON.stringify(aCustomers));
            
            // Extract unique values for each filter field
            var aAccountGroups = that._getUniqueValues(aCustomers, "customerAccountGroup");
            var aCountries = that._getUniqueValues(aCustomers, "countryCode");
            var aSalesOrgs = that._getUniqueValues(aCustomers, "salesOrg");
            var aDistChannels = that._getUniqueValues(aCustomers, "Distributionchannel");
            var aDivisions = that._getUniqueValues(aCustomers, "Division");
            var aSalesOffices = that._getUniqueValues(aCustomers, "SalesOffice");
            
            // Update filter model
            that._oFilterModel.setData({
                accountGroups: aAccountGroups.map(function(value) {
                    return { key: value, text: value };
                }),
                countries: aCountries.map(function(value) {
                    return { key: value, text: value };
                }),
                salesOrgs: aSalesOrgs.map(function(value) {
                    return { key: value, text: value };
                }),
                distChannels: aDistChannels.map(function(value) {
                    return { key: value, text: value };
                }),
                divisions: aDivisions.map(function(value) {
                    return { key: value, text: value };
                }),
                salesOffices: aSalesOffices.map(function(value) {
                    return { key: value, text: value };
                })
            });
            
            // Apply initial tab filter
            that._filterTableByStatus(that._currentTabKey);
        },
        
        // Helper function to extract unique values from an array of objects
        _getUniqueValues: function(aObjects, sProperty) {
            var aValues = [];
            var oUniqueValues = {};
            
            aObjects.forEach(function(oObject) {
                var sValue = oObject[sProperty];
                if (sValue && !oUniqueValues[sValue]) {
                    oUniqueValues[sValue] = true;
                    aValues.push(sValue);
                }
            });
            
            return aValues.sort();
        },
        
        // Helper function to safely check if a string contains a substring (case-insensitive)
        _stringContains: function(sString, sSubstring) {
            if (!sString || typeof sString !== 'string') {
                return false;
            }
            return sString.toLowerCase().indexOf(sSubstring.toLowerCase()) !== -1;
        },
        
        // Handle tab selection
        onTabSelect: function(oEvent) {
            var sKey = oEvent.getParameter("key");
            this._currentTabKey = sKey;
            this._applyAllFilters();
        },
        
        // Filter table based on selected tab
        _filterTableByStatus: function(sStatus) {
            this._currentTabKey = sStatus;
            this._applyAllFilters();
        },
        
        // Handle search functionality
        onSearch: function(oEvent) {
            var sQuery = oEvent.getParameter("query");
            console.log("Search query:", sQuery);
            this._searchQuery = sQuery;
            this._applyAllFilters();
        },
        
        onSearchLiveChange: function(oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            console.log("Search live change:", sQuery);
            this._searchQuery = sQuery;
            this._applyAllFilters();
        },
        
        // Apply all active filters to the table
        _applyAllFilters: function() {
            if (!this._originalTableData || this._originalTableData.length === 0) {
                console.log("No data available for filtering");
                return; // Wait until data is available
            }
            
            console.log("Applying filters - Tab:", this._currentTabKey, "Search:", this._searchQuery);
            
            var that = this;
            var aFiltered = this._originalTableData.slice(); // Clone array
            
            console.log("Original data count:", aFiltered.length);
            
            // For debugging: ensure status property exists on data
            aFiltered.forEach(function(item, idx) {
                if (!item.status) {
                    console.warn("Missing status on item", idx, item);
                    // Add default status if missing
                    item.status = "created";
                }
            });
            
            // 1. First filter by tab status if it's available
            if (this._currentTabKey) {
                aFiltered = aFiltered.filter(function(item) {
                    return item.status === that._currentTabKey;
                });
                console.log("After tab filter:", aFiltered.length);
            }
            
            // 2. Apply search query if exists
            if (this._searchQuery && this._searchQuery.length > 0) {
                var sQuery = this._searchQuery.toLowerCase();
                aFiltered = aFiltered.filter(function(item) {
                    return (
                        that._stringContains(item.customerId, sQuery) ||
                        that._stringContains(item.customerNameEn, sQuery) ||
                        that._stringContains(item.mobileNo, sQuery) ||
                        that._stringContains(item.requestId, sQuery)
                    );
                });
                console.log("After search filter:", aFiltered.length);
            }
            
            // 3. Apply filter dialog filters
            if (Object.keys(this._activeFilters).length > 0) {
                aFiltered = aFiltered.filter(function(item) {
                    var bMatch = true;
                    
                    // Check each active filter
                    if (that._activeFilters.accountGroup && 
                        item.customerAccountGroup !== that._activeFilters.accountGroup) {
                        bMatch = false;
                    }
                    
                    if (that._activeFilters.country && 
                        item.countryCode !== that._activeFilters.country) {
                        bMatch = false;
                    }
                    
                    if (that._activeFilters.salesOrg && 
                        item.salesOrg !== that._activeFilters.salesOrg) {
                        bMatch = false;
                    }
                    
                    if (that._activeFilters.distChannel && 
                        item.Distributionchannel !== that._activeFilters.distChannel) {
                        bMatch = false;
                    }
                    
                    if (that._activeFilters.division && 
                        item.Division !== that._activeFilters.division) {
                        bMatch = false;
                    }
                    
                    if (that._activeFilters.salesOffice && 
                        item.SalesOffice !== that._activeFilters.salesOffice) {
                        bMatch = false;
                    }
                    
                    return bMatch;
                });
                console.log("After advanced filters:", aFiltered.length);
            }
            
            // Update the model with filtered data
            var oModel = this.getOwnerComponent().getModel("customerData");
            var oData = oModel.getData() || {};
            oData.customers = aFiltered;
            oModel.setData(oData);
            console.log("Updated model with filtered data:", aFiltered.length);
            
            // Update tab counts
            this._updateTabCounts();
        },
        
        // Update tab counts based on current data
        _updateTabCounts: function() {
            if (!this._originalTableData) {
                return;
            }
            
            var aCounts = {
                created: 0,
                underReview: 0,
                cancelled: 0
            };
            
            // Count by status
            this._originalTableData.forEach(function(item) {
                if (item.status && aCounts[item.status] !== undefined) {
                    aCounts[item.status]++;
                }
            });
            
            // Update tab model
            var oTabModel = this.getView().getModel("tabStatusModel");
            var aTabData = oTabModel.getData().tabStatuses;
            
            aTabData.forEach(function(tab) {
                tab.count = String(aCounts[tab.key] || 0);
            });
            
            oTabModel.refresh(true);
        },
        
        // Open filter dialog
        onOpenFilterDialog: function() {
            var oView = this.getView();
            
            // Create dialog lazily
            if (!this._oFilterDialog) {
                Fragment.load({
                    id: oView.getId(),
                    name: "com.exa.alfanar.view.fragment.FilterDialog",
                    controller: this
                }).then(function(oDialog) {
                    // Connect dialog to view
                    oView.addDependent(oDialog);
                    this._oFilterDialog = oDialog;
                    
                    // Set current filter values
                    this._setFilterValues();
                    
                    this._oFilterDialog.open();
                }.bind(this));
            } else {
                // Set current filter values
                this._setFilterValues();
                this._oFilterDialog.open();
            }
        },
        
        // Set filter values in dialog based on active filters
        _setFilterValues: function() {
            if (!this._oFilterDialog) {
                return;
            }
            
            try {
                this.byId("accountGroupFilter").setSelectedKey(this._activeFilters.accountGroup || "");
                this.byId("countryFilter").setSelectedKey(this._activeFilters.country || "");
                this.byId("salesOrgFilter").setSelectedKey(this._activeFilters.salesOrg || "");
                this.byId("distChannelFilter").setSelectedKey(this._activeFilters.distChannel || "");
                this.byId("divisionFilter").setSelectedKey(this._activeFilters.division || "");
                this.byId("salesOfficeFilter").setSelectedKey(this._activeFilters.salesOffice || "");
            } catch (e) {
                // Some controls might not be available yet
                console.log("Error setting filter values:", e);
            }
        },
        
        // Apply filter from dialog
        onApplyFilter: function() {
            // Get filter values from dialog
            this._activeFilters = {
                accountGroup: this.byId("accountGroupFilter").getSelectedKey(),
                country: this.byId("countryFilter").getSelectedKey(),
                salesOrg: this.byId("salesOrgFilter").getSelectedKey(),
                distChannel: this.byId("distChannelFilter").getSelectedKey(),
                division: this.byId("divisionFilter").getSelectedKey(),
                salesOffice: this.byId("salesOfficeFilter").getSelectedKey()
            };
            
            // Remove empty filters
            Object.keys(this._activeFilters).forEach(key => {
                if (!this._activeFilters[key]) {
                    delete this._activeFilters[key];
                }
            });
            
            // Apply filters
            this._applyAllFilters();
            
            // Close dialog
            this._oFilterDialog.close();
        },
        
        // Reset filter values
        onResetFilter: function() {
            // Reset filter comboboxes
            try {
                this.byId("accountGroupFilter").setSelectedKey("");
                this.byId("countryFilter").setSelectedKey("");
                this.byId("salesOrgFilter").setSelectedKey("");
                this.byId("distChannelFilter").setSelectedKey("");
                this.byId("divisionFilter").setSelectedKey("");
                this.byId("salesOfficeFilter").setSelectedKey("");
            } catch (e) {
                console.log("Error resetting filter values:", e);
            }
            
            // Clear active filters
            this._activeFilters = {};
            
            // Apply reset
            this._applyAllFilters();
            
            // Close dialog
            this._oFilterDialog.close();
        },
        
        // Handle Add Customer button press
        onAddCustomer: function() {
            // Navigate to customer creation view
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("CustomerUpdate");
        }
    });
});