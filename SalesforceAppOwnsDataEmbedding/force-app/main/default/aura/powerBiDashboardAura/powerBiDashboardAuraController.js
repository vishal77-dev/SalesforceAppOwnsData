({
    afterScriptsLoaded: function (component, event, helper) {
        console.log("afterScriptsLoaded");
        var workspaceId = component.get("v.workspaceId");
        var dashboardId = component.get("v.dashboardId");
        
        
        console.log("afterScriptsLoaded 2B");
        
        var pattern = new RegExp(
            "^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$",
            "i"
        );
        
        console.log("afterScriptsLoaded 5");
        
        workspaceIdIsValidGuid = pattern.test(workspaceId);
        dashboardIdIsValidGuid = pattern.test(dashboardId);
        
        console.log("afterScriptsLoaded 6");
        
        if (!workspaceIdIsValidGuid || !dashboardIdIsValidGuid) {
            component.set("v.IsSpinner",false);
            component.set(
                "v.errorMessage",
                "Workspace ID and dashboard ID must be configured as valid GUID!"
            );
        } else {
            console.log("Embedding dashboard");
            component.set("v.errorMessage", undefined);
            
            var action = component.get("c.getEmbeddingDataForDashboard");
            
            console.log("Embedding dashboard 2");
            
            action.setParams({
                WorkspaceId: component.get("v.workspaceId"),
                DashboardId: component.get("v.dashboardId")
            });
            
            console.log("Embedding dashboard 3");
            
            action.setCallback(this, function (response) {
                console.log("callback executing");
                var state = response.getState();
                if (state === "SUCCESS") {
                    console.log("callback success");
                    
                    var embeddingData = response.getReturnValue();
                    
                    console.log("embeddingData", embeddingData);
                    
                    if(embeddingData.error){
                        component.set("v.errorMessage", embeddingData.error);
                        component.set("v.IsSpinner",false);
                    }
                    var models = window['powerbi-client'].models;
                    if(embeddingData.embedUrl){
                        var dashboardId = embeddingData.dashboardId;
                        var embedUrl = embeddingData.embedUrl;
                        var token = embeddingData.embedToken;
                        
                        var config = {
                            type: "dashboard",
                            id: dashboardId,
                            embedUrl: embedUrl,
                            accessToken: token,
                            pageView: 'actualSize',
                            tokenType: 1,
                            settings: {
                                panes: {
                                    filters: { expanded: false, visible: false },
                                    pageNavigation: { visible: false }
                                },
                                background: models.BackgroundType.Transparent
                            }
                        };
                        
                        // Embed the dashboard and display it within the div container.
                        var embedContainer = component.find("embed-container").getElement();
                        var dashboard = powerbi.embed(embedContainer, config);
                        
                        console.log(dashboard);
                        component.set("v.IsSpinner",false);
                        dashboard.on("loaded", function (event) {
                            console.log("loaded");
                            //document.write("<style>body {background-color:white;}</style>");
                        });
                        //dashboard.off("tileClicked");
                        dashboard.on("tileClicked", function (event) {
                            console.log(event.detail);
                            var Reportembedurl = event.detail.reportEmbedUrl;
                            var ReportSection = event.detail.pageName;
                            var nav = event.detail.navigationUrl;
                            var queryparams = Reportembedurl.split('?')[1];
                            var params = queryparams.split('&');
                            var pair = null,
                                data = [];
                            params.forEach(function(d) {
                                pair = d.split('=');
                                data.push({key: pair[0], value: pair[1]});
                            });
                            var eventReportId = data[0].value;
                            console.log('ReportId'+eventReportId);
                           
                            component.set("v.reportId",eventReportId);
                            component.set("v.workspaceId",workspaceId);
                            var urlVar = '/lightning/n/PowerBi_Report?c__reportId='+eventReportId+'&c__workspaceId='+workspaceId+'&c__pageName='+ReportSection;
                            var eUrl= $A.get("e.force:navigateToURL");
                            eUrl.setParams({
                                "url": urlVar
                            });
                            eUrl.fire();
                            
                        });
                        
                    }
                }
            });
            
            console.log("Embedding dashboard 4");
            
            $A.enqueueAction(action);
            
            
            
            
        }
    },
    Gobacktodashboard : function (component, event, helper) { 
        component.set("v.ShowReport",false);
        component.set("v.ShowDashboard",true);
        
        var a = component.get('c.afterScriptsLoaded');
        $A.enqueueAction(a);
    }
});