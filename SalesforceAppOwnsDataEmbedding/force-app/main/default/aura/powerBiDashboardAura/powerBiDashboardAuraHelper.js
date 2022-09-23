({
    fetchReport : function(component,ReportworkspaceId,eventReportId) {
        
    
        var pattern1 = new RegExp(
          "^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$",
          "i"
        );
    
        
        workspaceIdIsValidGuid = pattern1.test(ReportworkspaceId);
        reportIdIsValidGuid = pattern1.test(eventReportId);
    
        console.log("afterScriptsLoaded 6");
    
        if (!workspaceIdIsValidGuid || !reportIdIsValidGuid) {
          component.set(
            "v.errorMessage1",
            "Workspace ID and Report ID must be configured as valid GUID!"
          );
          component.set("v.ShowDashboard",false);
        } else {
          console.log("Embedding Report");
          component.set("v.errorMessage1", undefined);
    
          var action = component.get("c.getEmbeddingDataForReport");
    
          console.log("Embedding Report 2");
    
          action.setParams({
            WorkspaceId: ReportworkspaceId,
            ReportId: eventReportId
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
                component.set("v.errorMessage1", embeddingData.error);
                component.set("v.ShowDashboard",false);
              }
    
              if(embeddingData.embedUrl){
                var reportId = embeddingData.reportId;
                var embedUrl = embeddingData.embedUrl;
                var token = embeddingData.embedToken;
      
                var config = {
                  type: "report",
                  id: reportId,
                  embedUrl: embedUrl,
                  accessToken: token,
                  tokenType: 1,
                  settings: {
                    panes: {
                      filters: { expanded: false, visible: false },
                      pageNavigation: { visible: false }
                    }
                  }
                };
      
                // Embed the report and display it within the div container.
                component.set("v.ShowDashboard",false);
                var embedContainer = component.find("embed-container1").getElement();
                var report = powerbi.embed(embedContainer, config);
      
                console.log(report);
      
              }
            }
          });
    
          console.log("Embedding Report 4");
    
          $A.enqueueAction(action);
    
          console.log("Embedding Report 4");
        }

    }
})
