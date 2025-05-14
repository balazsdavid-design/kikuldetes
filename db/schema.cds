namespace kikuldetes;

using { Country,Currency} from '@sap/cds/common';




entity PostingsRegular : Postings {
    borrowedEUR : Decimal;
    borrowedHUF : Decimal;
    country : Country;
    @mandatory
    travel_to : Date;
    @mandatory
    travel_back : Date;
    departures_arrivals : Composition of many DeparturesAndArrivals 
    on departures_arrivals.posting = $self;
    daily_expenses : Composition of many DailyExpenses
     on daily_expenses.posting = $self;
    accomodations : Composition of many Accomodations on accomodations.posting = $self;
    material_expenses : Composition of many MaterialExpenses 
    on material_expenses.posting = $self;
    trip_expenses : Composition of many TripExpenses on trip_expenses.posting = $self

}

entity DeparturesAndArrivals {
    key ID : UUID;
    @mandatory
    from_where : String;
    @mandatory
    departure : DateTime;
    @mandatory
    to_where : String;
    @mandatory
    arrival : DateTime;
    posting : Association to PostingsRegular;
    meanOfTransport : Association to one MeansOfTransport

}

aspect Expense {
    @mandatory
    days : Integer ;
    @mandatory
    currency : Currency;
    @mandatory
    daily_price : Decimal;
    key ID : UUID;

    
    
    paymentMethod : Association to one PaymentMethods;
    @mandatory
    date : Date;
    posting : Association to PostingsRegular;
}


entity DailyExpenses : Expense {
    
    

}

entity Accomodations : Expense {
    @mandatory
    accomodation_name : String;
    
}



aspect OtherExpense {
    key ID : UUID;
    @mandatory
    reference : String;
    @mandatory
    date : Date;
    @mandatory
    name : String;
    currency : Currency;
    @mandatory
    price : Decimal;
    posting : Association to PostingsRegular;
    paymentMethod : Association to one PaymentMethods;
}

entity MaterialExpenses : OtherExpense {
    
}

entity TripExpenses : OtherExpense {

}

aspect Postings {
    key ID : UUID;
    @mandatory
    goal : String;
    employee : Association to one Employees;
    
    
    status : Association to one Statuses;

    @UI.Hidden
    restriction : Integer default 0;
    
    
    
    virtual submittable : Boolean default true;
    @UI.Hidden
    virtual backOffice : Boolean default false;
    serialNumber : String;
    
    virtual editing : Boolean default false;
}

entity Statuses {
    key ID : Integer;
    @mandatory
    statusText : localized String;
    
}


entity PostingsWithCar : Postings, Car {
    
    
    data : Composition of many PostingDataWithCar on data.posting = $self;
    stickers : Composition of many HighwayStickers on stickers.posting = $self;
    
    
}

entity SerialNumbers {
    key yearMonth : String; 
    lastNumber: Integer 
}


entity FuelTypes  {
    key ID : Integer;
    name : localized String;
    ICE : Boolean;
    
}


entity PaymentMethods {
    @readonly
    key ID: Integer;
    @mandatory
    name : String;
}


entity HighwayStickers {
    key ID : UUID;
    @mandatory
    country : Country;
    price : Decimal;
    currency : Currency;
    @mandatory
    date : Date;
    posting : Association to PostingsWithCar;
}

entity MeansOfTransport {
    @readonly
    key ID : Integer;
    @mandatory
    name : String;
}

entity FuelPrices {
    
    @readonly
    key yearMonth : String;
    @mandatory
    petrolPrice : Decimal;
    @mandatory
    dieselPrice : Decimal;
}

entity FuelConsumptions {
    @readonly
    key ID : Integer;
    @mandatory
    fuelType : Association to one FuelTypes;
    
    volumeStart : Integer;
    volumeEnd : Integer;
    @mandatory
    consumption : Decimal;
}

entity PostingDataWithCar {
     key ID : UUID;
    posting : Association to PostingsWithCar;
    @mandatory
    date : Date;
    @mandatory
    from_where : String;
    @mandatory
    to_where : String;
    @mandatory
    mileage : Integer;
    
    daily_expense : Integer;


}

aspect Car {
    @mandatory
    fuel_type : Association to one FuelTypes;
    @mandatory
    plateNum : String;
    cylinder_volume : Integer;
    
    


}


entity Employees {
    key ID : String;
    name : String;
    position : String;
    address : String;
    birthDate : String;
    birthPlace : String;
    mothersName : String;
    taxNumber : String;

}

entity Employers {
    key ID : Integer;
    name : String;
    address : String;
    taxNumber : String;
}

