namespace kikuldetes;
using { Country,} from '@sap/cds/common';




entity PostingsRegular : Postings {
    
    country : Country;
    travel_to : Date;
    travel_back : Date;
    departures_arrivals : Composition of many DeparturesAndArrivals 
    on departures_arrivals.posting = $self;
    daily_expenses : Composition of many DailyExpenses
     on daily_expenses.posting = $self;
    accomodations : Composition of many Accomodations on accomodations.posting = $self;
    material_expenses : Composition of many MaterialExpenses 
    on material_expenses.posting = $self

}

entity DeparturesAndArrivals {
    key ID : UUID;
    from_where : String;
    departure : DateTime;
    to_where : String;
    arrival : DateTime;
    posting : Association to PostingsRegular;

}

aspect Expense {
    days : Integer;
    currency : String;
    daily_price : Decimal;
}

entity DailyExpenses : Expense {
    key ID : UUID;
    date : Date;
    posting : Association to PostingsRegular;
    

}

entity Accomodations : Expense {
    key ID : UUID;
    accomodation_name : String;
    posting : Association to PostingsRegular;
}

entity MaterialExpenses {
    key ID : UUID;
    reference : String;
    date : Date;
    name : String;
    currency : String;
    price : Decimal;
    posting : Association to PostingsRegular;
}

aspect Postings {
    key ID : UUID;
    goal : String;
    employee : Association to one Employees;
    employer : Association to one Employers;
    
}


entity PostingsWithCar : Postings, Car {
    
    
    data : Composition of many PostingDataWithCar on data.posting = $self;
    stickers : Composition of many HighwayStickers on stickers.posting = $self;
    
    
}



entity FuelTypes  {
    key ID : Integer;
    name : String;
    ICE : Boolean;
    
}



entity HighwayStickers {
    key ID : UUID;
    country : Country;
    price : Decimal;
    currency : String;
    posting : Association to PostingsWithCar;
}


entity PostingDataWithCar {
     key ID : UUID;
    posting : Association to PostingsWithCar;
    date : Date;
    from_where : String;
    to_where : String;
    mileage : Integer;
    
    daily_expense : Integer;


}

aspect Car {
    fuel_type : Association to one FuelTypes;
    plateNum : String;
    cylinder_volume : Integer;
    fuel_consumption : Decimal;
    amortization : Decimal;
    fuel_price : Decimal;


}


entity Employees {
    key ID : Integer;
    name : String;
    position : String;
    employer : String;
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

