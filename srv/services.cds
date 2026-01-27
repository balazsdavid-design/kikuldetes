using kikuldetes as my from '../db/schema';
@impl : 'srv/services.js'
@requires: 'authenticated-user'
service AppService {
    
  
    
    @cds.redirection.target
    @odata.draft.enabled
    
    entity PostingsRegular  as projection on my.PostingsRegular actions {
      action submitRegular() returns PostingsRegular;
      action unsubmitRegular() returns PostingsRegular;
      action rejectRegular() returns PostingsRegular;
      action acceptRegular() returns PostingsRegular;

    }; 

    entity DeparturesAndArrivals as projection on my.DeparturesAndArrivals;

    entity DailyExpenses as projection on my.DailyExpenses;
    entity Accomodations as projection on my.Accomodations;
    entity MaterialExpenses as projection on my.MaterialExpenses;

    
    
    entity Statuses as projection on my.Statuses;


     
    @cds.redirection.target
    @odata.draft.enabled
    
    entity PostingsWithCar as projection on my.PostingsWithCar  actions {
    action submit() returns PostingsWithCar;
    action unsubmit() returns PostingsWithCar;
    
    //@requires : 'Backoffice'
    action reject_() returns PostingsWithCar;
    action accept() returns PostingsWithCar;
    } ;
    @odata.draft.enabled
    @requires : 'Backoffice'
    entity FuelConsumptions as projection on my.FuelConsumptions;
  
    entity FuelTypes as projection on my.FuelTypes;
    
    
    entity PostingDataWithCar as projection on my.PostingDataWithCar;
    @odata.draft.enabled
    //@requires : 'Backoffice'
    entity FuelPrices as projection on my.FuelPrices;
     
    entity HighwayStickers as projection on my.HighwayStickers;
    
    entity SerialNumbers as projection on my.SerialNumbers;
  @odata.draft.enabled
  entity Employees as projection on my.Employees;
  entity Employers as projection on my.Employers;

  

   @odata.draft.enabled
   //@requires : 'Backoffice'
  entity PaymentMethods as projection on my.PaymentMethods;
  @odata.draft.enabled
  
  entity MeansOfTransport as projection on my.MeansOfTransport;

  entity TripExpenses as projection on my.TripExpenses;

  function getPDFCar ( ID: String) returns Binary;


  //@requires : 'Backoffice'
  function getPDFRegular(ID : String) returns Binary;
  

  

  

  
  

}