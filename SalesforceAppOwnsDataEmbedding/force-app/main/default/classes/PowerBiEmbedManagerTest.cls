@isTest
public class PowerBiEmbedManagerTest {
    
    Public static testMethod void Reporttest(){
        Test.setMock(HttpCalloutMock.class, new PowerBiEmbedManagerMockClass(200));
        Test.startTest();
        PowerBiEmbedManager.getEmbeddingDataForReport('f089354e-8366-4e18-aea3-4cb4a3a50b48','b218778-e7a5-4d73-8187-f10824047715');
        PowerBiEmbedManager.getEmbeddingDataForDashboard('f089354e-8366-4e18-aea3-4cb4a3a50b48','69ffaa6c-b36d-4d01-96f5-1ed67c64d4af');
        Test.stopTest();
    }
    Public static testMethod void Dashboardtest(){
        Test.setMock(HttpCalloutMock.class, new PowerBiEmbedManagerMockClass(404));
        Test.startTest();
        PowerBiEmbedManager.getEmbeddingDataForReport('f089354e-8366-4e18-aea3-4cb4a3a50b48','b218778-e7a5-4d73-8187-f10824047715');
        PowerBiEmbedManager.getEmbeddingDataForDashboard('f089354e-8366-4e18-aea3-4cb4a3a50b48','69ffaa6c-b36d-4d01-96f5-1ed67c64d4af');
        Test.stopTest();
        
        
    }
    
}