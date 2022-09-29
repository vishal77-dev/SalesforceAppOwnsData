({
    afterScriptsLoaded: function (component, event, helper) {
        console.log("afterScriptsLoaded");
        console.log(component.get("v.pageReference").state.c__workspaceId);
        console.log(component.get("v.pageReference").state.c__reportId);
        var workspaceId = component.get("v.pageReference").state.c__workspaceId;
        var reportId = component.get("v.pageReference").state.c__reportId;
        var pageName = component.get("v.pageReference").state.c__pageName;
        
        console.log("afterScriptsLoaded 2B");
        
        var pattern = new RegExp(
            "^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$",
            "i"
        );
        
        console.log("afterScriptsLoaded 5");
        
        workspaceIdIsValidGuid = pattern.test(workspaceId);
        reportIdIsValidGuid = pattern.test(reportId);
        
        console.log("afterScriptsLoaded 6");
        
        if (!workspaceIdIsValidGuid || !reportIdIsValidGuid) {
            component.set(
                "v.errorMessage",
                "Workspace ID and Report ID must be configured as valid GUID!"
            );
        } else {
            console.log("Embedding Report");
            component.set("v.errorMessage", undefined);
            
            var action = component.get("c.getEmbeddingDataForReport");
            
            console.log("Embedding Report 2");
            
            action.setParams({
                WorkspaceId: workspaceId,
                ReportId: reportId
            });
            
            console.log("Embedding Report 3");
            
            action.setCallback(this, function (response) {
                console.log("callback executing");
                var state = response.getState();
                if (state === "SUCCESS") {
                    console.log("callback success");
                    
                    var embeddingData = response.getReturnValue();
                    
                    console.log("embeddingData", embeddingData);
                    
                    if(embeddingData.error){
                        component.set("v.errorMessage", embeddingData.error);
                    }
                    
                    var models = window['powerbi-client'].models;
                    console.log(models);
                    if(embeddingData.embedUrl){
                        var reportId = embeddingData.reportId;
                        var embedUrl = embeddingData.embedUrl;
                        var token = embeddingData.embedToken;
                        
                        var config = {
                            type: "report",
                            id: reportId,
                            embedUrl: embedUrl,
                            accessToken: token,
                            pageName : pageName,
                            tokenType: 1,
                            settings: {
                                panes: {
                                    filters: { expanded: true, visible: true },
                                    pageNavigation: { visible: true, position: models.PageNavigationPosition.Left }
                                }
                            }
                        };
                        
                        // Embed the report and display it within the div container.
                        var embedContainer = component.find("embed-container").getElement();
                        var report = powerbi.embed(embedContainer, config);
                        report.on("rendered", function () {
                            console.log("Rendered");
                        });
                        component.set("v.report",report);
                        console.log(report);
                        
                    }
                }
            });
            
            console.log("Embedding Report 4");
            
            $A.enqueueAction(action);
            
            console.log("Embedding Report 4");
        }
    },
    RefreshReport: function (component, event, helper) {
         var a = component.get('c.afterScriptsLoaded');
        $A.enqueueAction(a);
    }
});