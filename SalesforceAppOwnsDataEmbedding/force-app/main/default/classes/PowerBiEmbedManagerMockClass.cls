global  class PowerBiEmbedManagerMockClass implements HttpCalloutMock {
    
    public Integer statusCode;
    
    public PowerBiEmbedManagerMockClass(Integer statusCode){
        this.statusCode = statusCode;
    }
    global HTTPResponse respond(HTTPRequest req) {
        // Optionally, only send a mock response for a specific endpoint
        // and method.
        
        //System.assertEquals('GET', req.getMethod());
        
        // Create a fake response
        if(req.getEndpoint().contains('GenerateToken')){
            system.debug('StatusCode***'+this.statusCode);
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            res.setBody('{"example":"test"}');
            res.setStatus('Fail to load data');
            res.setStatusCode(this.statusCode);
            return res;
        }
        else{
            
            
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            res.setBody('{"example":"test"}');
            res.setStatusCode(this.statusCode);
            return res;
        }
        
        
    }         
}