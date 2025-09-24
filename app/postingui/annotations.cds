using AppService as service from '../../srv/services';
using from '../../db/schema';


annotate service.Employees with @(
    UI.LineItem #tableView : [
        {
            $Type : 'UI.DataField',
            Value : ID,
            Label : '{i18n>ID}',
        },
        {
            $Type : 'UI.DataField',
            Value : name,
            Label : '{i18n>Name}',
        },
    ],
    UI.SelectionPresentationVariant #tableView : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
        Text : '{i18n>Employees}',
    },
    UI.HeaderInfo : {
        Title : {
            $Type : 'UI.DataField',
            Value : name,
        },
        TypeName : '',
        TypeNamePlural : '',
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>PersonalData}',
            ID : 'i18nPersonalData',
            Target : '@UI.FieldGroup#i18nPersonalData',
        },
    ],
    UI.FieldGroup #i18nPersonalData : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : ID,
                Label : '{i18n>ID}',
            },
            {
                $Type : 'UI.DataField',
                Value : position,
                Label : '{i18n>Position}',
            },
            {
                $Type : 'UI.DataField',
                Value : name,
                Label : '{i18n>FirstName}',
            },
             {
                $Type : 'UI.DataField',
                Value : lastName,
                Label : '{i18n>LastName}',
            },
            {
                $Type : 'UI.DataField',
                Value : postal_code,
                Label : '{i18n>Postalcode}',
            },
            {
                $Type : 'UI.DataField',
                Value : city,
                Label : '{i18n>City}',
            },
            {
                $Type : 'UI.DataField',
                Value : address,
                Label : '{i18n>Address}',
            },
            {
                $Type : 'UI.DataField',
                Value : birthDate,
                Label : '{i18n>BirthDate}',
            },
            {
                $Type : 'UI.DataField',
                Value : birthPlace,
                Label : '{i18n>BirthPlace}',
            },
            {
                $Type : 'UI.DataField',
                Value : mothersName,
                Label : '{i18n>MothersName}',
            },
            {
                $Type : 'UI.DataField',
                Value : taxNumber,
                Label : '{i18n>TaxNum}',
            },
        ],
    },
    UI.ConnectedFields #connected : {
        $Type : 'UI.ConnectedFieldsType',
        Template : '{name} {lastName}',
        Data : {
            $Type : 'Core.Dictionary',
            name : {
                $Type : 'UI.DataField',
                Value : name,
            },
            lastName : {
                $Type : 'UI.DataField',
                Value : lastName,
            },
        },
    },
);

annotate service.PostingsWithCar with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : serialNumber,
                Label : '{i18n>SerialNumber}',
            },
            {
                $Type : 'UI.DataField',
                Value : goal,
                Label : '{i18n>PostingGoal}',
            },
            {
                $Type : 'UI.DataField',
                Value : employee_ID,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : '{i18n>GeneralInformation}',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>CarData}',
            ID : 'Cardata',
            Target : '@UI.FieldGroup#Cardata',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>TripData}',
            ID : 'Data',
            Target : 'data/@UI.LineItem#Data',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>HighwayStickers}',
            ID : 'HighwayStickers',
            Target : 'stickers/@UI.LineItem#HighwayStickers',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>Attachments}',
            ID : 'i18nAttachments',
            Target : 'attachments/@UI.LineItem#i18nAttachments',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : employee.fullName,
            Label : '{i18n>PostedName}',
        },
        {
            $Type : 'UI.DataField',
            Value : goal,
            Label : '{i18n>PostingGoal}',
        },
    ],
    
    UI.FieldGroup #Data : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : data.daily_expense,
                Label : 'daily_expense',
            },
            {
                $Type : 'UI.DataField',
                Value : data.date,
                Label : 'date',
            },
            {
                $Type : 'UI.DataField',
                Value : data.from_where,
                Label : 'from_where',
            },
            
            {
                $Type : 'UI.DataField',
                Value : data.ID,
                Label : 'ID',
            },
            {
                $Type : 'UI.DataField',
                Value : data.mileage,
                Label : 'mileage',
            },
           
            {
                $Type : 'UI.DataField',
                Value : data.to_where,
                Label : 'to_where',
            },
        ],
    },
    UI.FieldGroup #Cardata : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : plateNum,
                Label : '{i18n>PlateNumber}',
            },
            {
                $Type : 'UI.DataField',
                Value : fuel_type_ID,
                Label : '{i18n>FuelType}',
            },
            {
                $Type : 'UI.DataField',
                Value : cylinder_volume,
                Label : '{i18n>CylinderVolume}',
            },
        ],
    },
    
    UI.HeaderInfo : {
        TypeName : '{i18n>PostingCar}',
        TypeNamePlural : '',
    },
    UI.SelectionPresentationVariant #tableView : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
        Text : '{i18n>PostingsCar}',
    },
    UI.SelectionFields : [
        employee_ID,
        status_ID,
    ],
    UI.DataPoint #progress : {
        $Type : 'UI.DataPointType',
        Value : status_ID,
        Title : 'Státusz',
        TargetValue : 4,
        Visualization : #Progress,
    },
    UI.HeaderFacets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>StatusOf}',
            ID : 'Sttusz',
            Target : '@UI.FieldGroup#Sttusz',
        },
    ],
    UI.DataPoint #status_ID : {
        $Type : 'UI.DataPointType',
        Value : status_ID,
        Title : 'Státusz',
    },
    UI.FieldGroup #Sttusz : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : status_ID,
            },
        ],
    },
    UI.Identification : [
        
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'AppService.submit',
            Label : '{i18n>Submit}',
            Determining : true,
            @UI.Hidden : (not submittable or backOffice or editing) ,
            
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'AppService.reject',
            Label : '{i18n>Reject}',
            Determining : true,
            @UI.Hidden:( submittable or not backOffice or editing ) ,
            
            
            
            
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'AppService.unsubmit',
            Label : '{i18n>Unsubmit}',
            Determining : true,
            @UI.Hidden: ( submittable or backOffice or editing),
        },
    ],
    UI.ConnectedFields #connected : {
        $Type : 'UI.ConnectedFieldsType',
        Template : '{fuel_type_ID}-{cylinder_volume}',
        Data : {
            $Type : 'Core.Dictionary',
            fuel_type_ID : {
                $Type : 'UI.DataField',
                Value : fuel_type_ID,
            },
            cylinder_volume : {
                $Type : 'UI.DataField',
                Value : cylinder_volume,
            },
        },
    },
  
);

annotate service.PostingsWithCar with {

    

    employee @(
        Common.Text : {
            $value : employee.fullName,
            ![@UI.TextArrangement] : #TextOnly
        },
        Common.Label : '{i18n>Posted}',
        
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Employees',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : employee_ID,
                    ValueListProperty : 'ID',
                },
            ],
        },
        Common.ValueListWithFixedValues : true,
        Common.FieldControl : restriction
        )
};





annotate service.PostingDataWithCar with @(
    UI.LineItem #Data : [
        {
            $Type : 'UI.DataField',
            Value : posting.data.date,
            Label : '{i18n>Date}',
        },
        {
            $Type : 'UI.DataField',
            Value : posting.data.from_where,
            Label : '{i18n>FromWhere}',
        },
        {
            $Type : 'UI.DataField',
            Value : posting.data.to_where,
            Label : '{i18n>ToWhere}',
        },
        {
            $Type : 'UI.DataField',
            Value : posting.data.mileage,
            Label : '{i18n>Mileage}',
        },
        {
            $Type : 'UI.DataField',
            Value : posting.data.daily_expense,
            Label : '{i18n>DailyExpense}',
        },
    ]
);

annotate service.HighwayStickers with @(
    UI.LineItem #HighwayStickers : [
        {
            $Type : 'UI.DataField',
            Value : country_code,
        },
        {
            $Type : 'UI.DataField',
            Value : price,
            Label : '{i18n>Price}',
        },
        {
            $Type : 'UI.DataField',
            Value : date,
            Label : '{i18n>Date}',
        },
    ]
);



annotate service.FuelTypes with {
    ID @Common.Text : {
        $value : name,
        ![@UI.TextArrangement] : #TextOnly,
    }
};



annotate service.PostingsWithCar with {
    fuel_type @(
        Common.Text : {
            $value : fuel_type.name,
            ![@UI.TextArrangement] : #TextOnly,
        },
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'FuelTypes',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : fuel_type_ID,
                    ValueListProperty : 'ID',
                },
            ],
            Label : 'Types',
        },
        Common.ValueListWithFixedValues : true,
        Common.FieldControl : #Mandatory,
    )
};

annotate service.FuelTypes with @(
    Communication.Contact #contact : {
        $Type : 'Communication.ContactType',
        fn : name,
    }
);

annotate service.PostingsRegular with @(
    UI.LineItem #tableView : [
        {
            $Type : 'UI.DataField',
            Value : employee.fullName,
            Label : '{i18n>PostedName}',
        },
        {
            $Type : 'UI.DataField',
            Value : goal,
            Label : '{i18n>PostingGoal}',
        },
    ],
    UI.SelectionPresentationVariant #tableView : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
        Text : '{i18n>PostingsAbroad}',
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>GeneralInformation}',
            ID : 'GeneralInformation',
            Target : '@UI.FieldGroup#GeneralInformation',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>DepandArr}',
            ID : 'DeparturesandArrivals',
            Target : 'departures_arrivals/@UI.LineItem#DeparturesandArrivals',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>DailyExpenses}',
            ID : 'Dailyexpenses',
            Target : 'daily_expenses/@UI.LineItem#Dailyexpenses',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>Accomodations}',
            ID : 'Accomodations',
            Target : 'accomodations/@UI.LineItem#Accomodations',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>MaterialExpenses}',
            ID : 'Materialexpenses',
            Target : 'material_expenses/@UI.LineItem#Materialexpenses',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>TripExpenses}',
            ID : 'Tripexpenses',
            Target : 'trip_expenses/@UI.LineItem#Tripexpenses',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>Attachments}',
            ID : 'i18nAttachments',
            Target : 'attachments/@UI.LineItem#i18nAttachments1',
        },
    ],
    UI.FieldGroup #GeneralInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : goal,
                Label : '{i18n>PostingGoal}',
            },
            {
                $Type : 'UI.DataField',
                Value : serialNumber,
                Label : '{i18n>SerialNumber}',
            },
            {
                $Type : 'UI.DataField',
                Value : employee_ID,
                Label : '{i18n>Employee}',
            },
            {
                $Type : 'UI.DataField',
                Value : country_code,
            },
            {
                $Type : 'UI.DataField',
                Value : travel_to,
                Label : '{i18n>TravelTo}',
            },
            {
                $Type : 'UI.DataField',
                Value : travel_back,
                Label : '{i18n>TravelBack}',
            },
            {
                $Type : 'UI.DataField',
                Value : borrowedEUR,
                Label : '{i18n>BorrowedEUR}',
            },
            {
                $Type : 'UI.DataField',
                Value : borrowedHUF,
                Label : '{i18n>BorrowedHUF}',
            },
        ],
    },
    UI.HeaderInfo : {
        TypeName : '{i18n>PostingAbroad}',
        TypeNamePlural : '',
    },
    UI.Identification : [
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'AppService.submitRegular',
            Label : '{i18n>Submit}',
            Determining : true,
            @UI.Hidden : (not submittable or backOffice or editing) 
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'AppService.unsubmitRegular',
            Label : '{i18n>Unsubmit}',
            Determining : true,
            @UI.Hidden : ( submittable or backOffice or editing)
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'AppService.rejectRegular',
            Label : '{i18n>Reject}',
            Determining : true,
            @UI.Hidden : ( submittable or not backOffice or editing )
        },
    ],
    UI.HeaderFacets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>StatusOf}',
            ID : 'Sttusz',
            Target : '@UI.FieldGroup#Sttusz',
        },
    ],
    UI.FieldGroup #Sttusz : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : status_ID,
                Label : '{i18n>Status}',
            },
        ],
    },
    );

annotate service.PostingsRegular with {
    employee @(
        Common.Text : {
            $value : employee.fullName,
            ![@UI.TextArrangement] : #TextOnly
        },
        Common.FieldControl : restriction,
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Employees',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : employee_ID,
                    ValueListProperty : 'ID',
                },
            ],
        },
        Common.ValueListWithFixedValues : true,
    )
};

annotate service.DeparturesAndArrivals with @(
    UI.LineItem #DeparturesandArrivals : [
        {
            $Type : 'UI.DataField',
            Value : from_where,
            Label : '{i18n>FromWhere}',
        },
        {
            $Type : 'UI.DataField',
            Value : departure,
            Label : '{i18n>Departure}',
        },
        {
            $Type : 'UI.DataField',
            Value : to_where,
            Label : '{i18n>ToWhere}',
        },
        {
            $Type : 'UI.DataField',
            Value : arrival,
            Label : '{i18n>Arrival}',
        },
        {
            $Type : 'UI.DataField',
            Value : meanOfTransport_ID,
            Label : '{i18n>MeanofTransport}',
        },
    ]
);

annotate service.DailyExpenses with @(
    UI.LineItem #Dailyexpenses : [
        {
            $Type : 'UI.DataField',
            Value : date,
            Label : '{i18n>Date}',
        },
        {
            $Type : 'UI.DataField',
            Value : days,
            Label : '{i18n>Days}',
        },
        {
            $Type : 'UI.DataField',
            Value : daily_price,
            Label : '{i18n>DailyPrice}',
        },
        {
            $Type : 'UI.DataField',
            Value : paymentMethod_ID,
            Label : '{i18n>PaymentMethod}',
            
            
            
        },
    ]
);

annotate service.Accomodations with @(
    UI.LineItem #Accomodations : [
        {
            $Type : 'UI.DataField',
            Value : accomodation_name,
            Label : '{i18n>AccomodationName}',
        },
        {
            $Type : 'UI.DataField',
            Value : date,
            Label : '{i18n>Date}',
        },
        {
            $Type : 'UI.DataField',
            Value : days,
            Label : '{i18n>Days}',
        },
        {
            $Type : 'UI.DataField',
            Value : daily_price,
            Label : '{i18n>PricePerNight}',
        },
        {
            $Type : 'UI.DataField',
            Value : paymentMethod_ID,
            Label : '{i18n>PaymentMethod}',
        },
    ]
);

annotate service.MaterialExpenses with @(
    UI.LineItem #Materialexpenses : [
        {
            $Type : 'UI.DataField',
            Value : reference,
            Label : '{i18n>Reference}',
        },
        {
            $Type : 'UI.DataField',
            Value : date,
            Label : '{i18n>Date}',
        },
        {
            $Type : 'UI.DataField',
            Value : name,
            Label : '{i18n>Title}',
        },
        {
            $Type : 'UI.DataField',
            Value : price,
            Label : '{i18n>Price}',
        },
        {
            $Type : 'UI.DataField',
            Value : paymentMethod_ID,
            Label : '{i18n>PaymentMethod}',
        },
    ]
);

annotate service.PostingsRegular with {
    country @(
        Common.Text : {
            $value : country.name,
            ![@UI.TextArrangement] : #TextOnly
        },
        Common.FieldControl : #Mandatory,
    )
};

annotate service.PostingsRegular with {
    goal @Common.FieldControl : #Mandatory
};

annotate service.PostingsRegular with {
    travel_to @Common.FieldControl : #Mandatory
};

annotate service.PostingsRegular with {
    travel_back @Common.FieldControl : #Mandatory
};

annotate service.DeparturesAndArrivals with {
    from_where @Common.FieldControl : #Mandatory
};

annotate service.DeparturesAndArrivals with {
    departure @Common.FieldControl : #Mandatory
};

annotate service.DeparturesAndArrivals with {
    to_where @Common.FieldControl : #Mandatory
};

annotate service.DeparturesAndArrivals with {
    arrival @Common.FieldControl : #Mandatory
};

annotate service.DailyExpenses with {
    date @Common.FieldControl : #Mandatory
};

annotate service.DailyExpenses with {
    days @Common.FieldControl : #Mandatory
};

annotate service.DailyExpenses with {
    daily_price @(
        Common.FieldControl : #Mandatory,
        Measures.ISOCurrency : currency_code,
    )
};

annotate service.PostingsWithCar with {
    plateNum @Common.FieldControl : #Mandatory
};

annotate service.PostingsWithCar with {
    data @Common.FieldControl : #Mandatory
};

annotate service.PostingDataWithCar with {
    date @Common.FieldControl : #Mandatory
};

annotate service.PostingDataWithCar with {
    from_where @Common.FieldControl : #Mandatory
};

annotate service.PostingDataWithCar with {
    to_where @Common.FieldControl : #Mandatory
};

annotate service.PostingDataWithCar with {
    mileage @Common.FieldControl : #Mandatory
};

annotate service.PostingDataWithCar with {
    daily_expense @Common.FieldControl : #Mandatory
};

annotate service.PostingsWithCar with {
    serialNumber @Common.FieldControl : #ReadOnly
};

annotate service.PostingsRegular with {
    serialNumber @Common.FieldControl : #ReadOnly
};

annotate service.DeparturesAndArrivals with {
    meanOfTransport @(Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'MeansOfTransport',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : meanOfTransport_ID,
                    ValueListProperty : 'ID',
                },
            ],
            Label : 'Means of transportation',
        },
        Common.ValueListWithFixedValues : true,
        Common.Text : {
            $value : meanOfTransport.name,
            ![@UI.TextArrangement] : #TextOnly
        },
        )};

annotate service.MeansOfTransport with {
    ID @Common.Text : {
        $value : name,
        ![@UI.TextArrangement] : #TextOnly,
    }
};

annotate service.DailyExpenses with {
    paymentMethod @(Common.ValueList : {
            $Type : 'Common.ValueListType',
            
            CollectionPath : 'PaymentMethods',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : paymentMethod_ID,
                    ValueListProperty : 'ID',
                },
            ],
            Label : 'Payment method',
        },
        
        Common.ValueListWithFixedValues : true,
        Common.Text : {
            $value : paymentMethod.name,
            ![@UI.TextArrangement] : #TextOnly,
            
            
        },
        Common.FieldControl : posting.restriction
        )};
 
annotate service.PaymentMethods with {
    ID @Common.Text : {
        $value : name,
        ![@UI.TextArrangement] : #TextOnly,
    }
};

annotate service.Accomodations with {
    paymentMethod @(Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'PaymentMethods',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : paymentMethod_ID,
                    ValueListProperty : 'ID',
                },
            ],
            Label : 'Payment method',
        },
        Common.ValueListWithFixedValues : true,
        Common.Text : {
            $value : paymentMethod.name,
            ![@UI.TextArrangement] : #TextOnly
        },
        Common.FieldControl :  posting.restriction
)};

annotate service.MaterialExpenses with {
    paymentMethod @(Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'PaymentMethods',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : paymentMethod_ID,
                    ValueListProperty : 'ID',
                },
            ],
            Label : 'Payment method',
        },
        Common.ValueListWithFixedValues : true,
        Common.Text : {
            $value : paymentMethod.name,
            ![@UI.TextArrangement] : #TextOnly
        },
        Common.FieldControl : posting.restriction
)};

annotate service.TripExpenses with @(
    UI.LineItem #Tripexpenses : [
        {
            $Type : 'UI.DataField',
            Value : posting.trip_expenses.reference,
            Label : '{i18n>Reference}',
        },
        {
            $Type : 'UI.DataField',
            Value : posting.trip_expenses.date,
            Label : '{i18n>Date}',
        },
        {
            $Type : 'UI.DataField',
            Value : posting.trip_expenses.name,
            Label : '{i18n>Title}',
        },
        {
            $Type : 'UI.DataField',
            Value : posting.trip_expenses.price,
            Label : '{i18n>Price}',
        },
        {
            $Type : 'UI.DataField',
            Value : paymentMethod_ID,
            Label : '{i18n>PaymentMethod}',
        },
    ]
);

annotate service.TripExpenses with {
    paymentMethod @(Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'PaymentMethods',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : paymentMethod_ID,
                    ValueListProperty : 'ID',
                },
            ],
            Label : 'Payment method',
        },
        Common.ValueListWithFixedValues : true,
        Common.Text : {
            $value : paymentMethod.name,
            ![@UI.TextArrangement] : #TextOnly
        },
        Common.FieldControl : posting.restriction
)};

annotate service.HighwayStickers with {
    country @(
        Common.ValueListWithFixedValues : true,
        Common.Text : {
            $value : country.name,
            ![@UI.TextArrangement] : #TextOnly
        },
        Common.FieldControl : #Mandatory,
    )
};

annotate service.PostingsRegular with {
    borrowedEUR @Common.FieldControl : #Optional
};

annotate service.PostingsRegular with {
    borrowedHUF @Common.FieldControl : #Optional
};

annotate service.HighwayStickers with {
    date @Common.FieldControl : #Mandatory
};

annotate service.PostingsWithCar with {
    status @(
        Common.Label : '{i18n>Status}',
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Statuses',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : status_ID,
                    ValueListProperty : 'ID',
                },
            ],
            Label : 'Kiküldetés státusza',
        },
        Common.ValueListWithFixedValues : true,
        Common.Text : {
            $value : status.statusText,
            ![@UI.TextArrangement] : #TextOnly,
        },
        Common.FieldControl : restriction,
        )
};

annotate service.Statuses with {
    ID @Common.Text : {
        $value : statusText,
        ![@UI.TextArrangement] : #TextOnly,
    }
};

annotate service.Statuses with @(
    UI.DataPoint #rating : {
        $Type : 'UI.DataPointType',
        Value : ID,
        Title : 'ID',
        TargetValue : 5,
        Visualization : #Rating,
    },
    UI.DataPoint #ID : {
        Value : ID,
        TargetValue : ID,
    },
    UI.Chart #ID : {
        ChartType : #Donut,
        Title : 'ID',
        Measures : [
            ID,
        ],
        MeasureAttributes : [
            {
                DataPoint : '@UI.DataPoint#ID',
                Role : #Axis1,
                Measure : ID,
            },
        ],
    },
);

annotate service.PostingsWithCar with {
    submittable @Common.FieldControl : #Mandatory
};

annotate service.PostingsRegular with {
    status @(Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Statuses',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : status_ID,
                    ValueListProperty : 'ID',
                },
            ],
        },
        Common.ValueListWithFixedValues : true,
        Common.Text : {
            $value : status.statusText,
            ![@UI.TextArrangement] : #TextOnly,
        },
        Common.FieldControl : restriction,
)};

annotate service.PostingsWithCar with {
    cylinder_volume @Common.FieldControl : #Optional
};

annotate service.Employees with @(
    UI.LineItem #tableView1 : [
        {
            $Type : 'UI.DataField',
            Value : ID,
            Label : '{i18n>ID}',
        },
    ],
    UI.SelectionPresentationVariant #tableView1 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView1',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
        Text : '{i18n>PersonalData}',
    }
);

annotate service.Accomodations with {
    daily_price @Measures.ISOCurrency : currency_code
};

annotate service.MaterialExpenses with {
    price @Measures.ISOCurrency : currency_code
};

annotate service.TripExpenses with {
    price @Measures.ISOCurrency : currency_code
};

annotate service.HighwayStickers with {
    price @Measures.ISOCurrency : currency_code
};

annotate service.PostingsRegular.attachments with @(
    UI.LineItem #Attachment : [
    ],
    UI.LineItem #i18nAttachments : [
    ],
    UI.LineItem #i18nAttachments1 : [
        {
            $Type : 'UI.DataField',
            Value : content,
            Label : '{i18n>Attachment}',
        },
        {
            $Type : 'UI.DataField',
            Value : mimeType,
            Label : '{i18n>MediaType}',
        },
    ],
);

annotate service.PostingsWithCar.attachments with @(
    UI.LineItem #i18nAttachments : [
        {
            $Type : 'UI.DataField',
            Value : content,
            Label : '{i18n>Attachment}',
        },
        {
            $Type : 'UI.DataField',
            Value : mimeType,
            Label : '{i18n>MediaType}',
        },
    ]
);

annotate service.Employees with {
    name @(
        Common.FieldControl : #ReadOnly,
        )
};

annotate service.Employees with {
    position @Common.FieldControl : #Mandatory
};

annotate service.Employees with {
    address @Common.FieldControl : #Mandatory
};

annotate service.Employees with {
    birthDate @Common.FieldControl : #Mandatory
};

annotate service.Employees with {
    birthPlace @Common.FieldControl : #Mandatory
};

annotate service.Employees with {
    mothersName @Common.FieldControl : #Mandatory
};

annotate service.Employees with {
    taxNumber @Common.FieldControl : #Mandatory
};

annotate service.Employees with {
    lastName @Common.FieldControl : #ReadOnly
};

annotate service.Employees with {
    postal_code @Common.FieldControl : #Mandatory
};

annotate service.Employees with {
    city @Common.FieldControl : #Mandatory
};

