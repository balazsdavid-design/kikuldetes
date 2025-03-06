using kikuldetes as my from '../db/schema';

service AppService {
    
    @requires: 'authenticated-user'
    @cds.redirection.target
    @odata.draft.enabled
    entity PostingsRegular  as projection on my.PostingsRegular;

    entity DeparturesAndArrivals as projection on my.DeparturesAndArrivals;

    entity DailyExpenses as projection on my.DailyExpenses;
    entity Accomodations as projection on my.Accomodations;
    entity MaterialExpenses as projection on my.MaterialExpenses;



    



     @requires: 'authenticated-user'
    @cds.redirection.target
    @odata.draft.enabled
    entity PostingsWithCar as projection on my.PostingsWithCar ;


    
    
    
  
    
    


    

     
    entity FuelTypes as projection on my.FuelTypes;
    
    @requires: 'authenticated-user'
    entity PostingDataWithCar as projection on my.PostingDataWithCar;


     @requires: 'authenticated-user'
    entity HighwayStickers as projection on my.HighwayStickers;
    
    
  entity Employees as projection on my.Employees;
  entity Employers as projection on my.Employers;


  function getPDFCar ( ID: String) returns Binary;

  function getPDFRegular(ID : String) returns Binary;
  

}