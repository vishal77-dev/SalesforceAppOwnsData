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
      component.set(
        "v.errorMessage",
        "Workspace ID and dashboard ID must be configured as valid GUID!"
      );
    } else {
      console.log("Embedding dashboard");
      component.set("v.errorMessage", undefined);

      var action = component.get("c.getEmbeddingDataFordashboard");

      console.log("Embedding dashboard 2");

      action.setParams({
        WorkspaceId: component.get("v.workspaceId"),
        dashboardId: component.get("v.dashboardId")
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
          }

          if(embeddingData.embedUrl){
            var dashboardId = embeddingData.dashboardId;
            var embedUrl = embeddingData.embedUrl;
            var token = embeddingData.embedToken;
  
            var config = {
              type: "dashboard",
              id: dashboardId,
              embedUrl: embedUrl,
              accessToken: token,
              tokenType: 1,
              pageView: 'fitToWidth'
            };
  
            // Embed the dashboard and display it within the div container.
            var embedContainer = component.find("embed-container").getElement();
            var dashboard = powerbi.embed(embedContainer, config);
  
            console.log(dashboard);
  
          }
        }
      });

      console.log("Embedding dashboard 4");

      $A.enqueueAction(action);

      console.log("Embedding dashboard 4");
    }
  }
});
