({
    fetchReport : function(component,ReportworkspaceId,eventReportId) {
        
    
        var pattern1 = new RegExp(
          "^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$",
          "i"
        );
    
        
        workspaceIdIsValidGuid1 = pattern1.test(ReportworkspaceId);
        reportIdIsValidGuid1 = pattern1.test(eventReportId);
    
        console.log("afterScriptsLoaded 6");
    
        if (!workspaceIdIsValidGuid1 || !reportIdIsValidGuid1) {
          component.set(
            "v.errorMessage1",
            "Workspace ID and Report ID must be configured as valid GUID!"
          );
          component.set("v.ShowDashboard",false);
        } else {
          console.log("Embedding Report");
          component.set("v.errorMessage1", undefined);
    
          var action1 = component.get("c.getEmbeddingDataForReport");
    
          console.log("Embedding Report 2");
    
          action1.setParams({
            WorkspaceId: ReportworkspaceId,
            ReportId: eventReportId
          });
    
          console.log("Embedding Report 3");
    
          action1.setCallback(this, function (response1) {
            console.log("callback executing");
            var state1 = response1.getState();
            if (state1 === "SUCCESS") {
              console.log("callback success");
    
              var embeddingData1 = response1.getReturnValue();
    
              console.log("embeddingData", embeddingData1);
    
              if(embeddingData1.error){
                component.set("v.errorMessage1", embeddingData1.error);
                component.set("v.ShowDashboard",false);
              }
    
              if(embeddingData1.embedUrl){
                var reportId1 = embeddingData1.reportId;
                var embedUrl1 = embeddingData1.embedUrl;
                var token1 = embeddingData1.embedToken;
      
                var config1 = {
                  type: "report",
                  id: reportId1,
                  embedUrl: embedUrl1,
                  accessToken: token1,
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
                var embedContainer1 = component.find("embed-container1").getElement();
                var report1 = powerbi.embed(embedContainer1, config1);
      
                console.log(report1);
      
              }
            }
          });
    
          console.log("Embedding Report 4");
    
          $A.enqueueAction(action1);
    
          console.log("Embedding Report 4");
        }

    }
})
