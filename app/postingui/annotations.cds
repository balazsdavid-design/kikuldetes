using AppService as service from '../../srv/services';
using from '@sap/cds/common';
using from '../../db/schema';


annotate service.PostingsWithCar with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'Employee ',
                Value : employee_ID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Employer',
                Value : employer_ID,
            },
            {
                $Type : 'UI.DataField',
                Value : userEmail,
                Label : 'userEmail',
            },
            {
                $Type : 'UI.DataField',
                Value : serialNumber,
                Label : 'serialNumber',
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Car data',
            ID : 'Cardata',
            Target : '@UI.FieldGroup#Cardata',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Data',
            ID : 'Data',
            Target : 'data/@UI.LineItem#Data',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Highway Stickers ',
            ID : 'HighwayStickers',
            Target : 'stickers/@UI.LineItem#HighwayStickers',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'Kiküldött neve',
            Value : employee_ID,
        },
        {
            $Type : 'UI.DataField',
            Value : goal,
            Label : 'Kiküldetés célja',
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
                Label : 'plateNum',
            },
            {
                $Type : 'UI.DataField',
                Value : fuel_type_ID,
                Label : 'fuel_type_ID',
            },
            {
                $Type : 'UI.DataField',
                Value : cylinder_volume,
                Label : 'cylinder_volume',
            },
        ],
    },
    
    UI.HeaderInfo : {
        TypeName : 'Posting with car',
        TypeNamePlural : '',
        Title : {
            $Type : 'UI.DataField',
            Value : goal,
        },
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
        Text : 'Saját autós kiküldetések',
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
            Label : 'Státusza',
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
            Label : 'Submit',
            Determining : true,
            @UI.Hidden : (not submittable or backOffice or editing) ,
            
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'AppService.reject',
            Label : 'Reject',
            Determining : true,
            @UI.Hidden:( submittable or not backOffice or editing ) ,
            
            
            
            
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'AppService.unsubmit',
            Label : 'Unsubmit',
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
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Employees',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : employee_ID,
                    ValueListProperty : 'ID',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'name',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'position',
                },
            ],
        },
        Common.Text : {
            $value : employee.name,
            ![@UI.TextArrangement] : #TextOnly
        },
        Common.Label : 'Kiküldött',
        Common.ValueListWithFixedValues : true,
    )
};

annotate service.PostingsWithCar with {
    employer @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Employers',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : employer_ID,
                    ValueListProperty : 'ID',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'name',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'address',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'taxNumber',
                },
            ],
        },
        Common.Text : {
            $value : employer.name,
            ![@UI.TextArrangement] : #TextOnly
        },
    )
};



annotate service.PostingDataWithCar with @(
    UI.LineItem #Data : [
        {
            $Type : 'UI.DataField',
            Value : posting.data.date,
            Label : 'Date',
        },
        {
            $Type : 'UI.DataField',
            Value : posting.data.from_where,
            Label : 'From',
        },
        {
            $Type : 'UI.DataField',
            Value : posting.data.to_where,
            Label : 'To',
        },
        {
            $Type : 'UI.DataField',
            Value : posting.data.mileage,
            Label : 'Mileage',
        },
        {
            $Type : 'UI.DataField',
            Value : posting.data.daily_expense,
            Label : 'Daily expense',
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
            Label : 'Price',
        },
        {
            $Type : 'UI.DataField',
            Value : currency_code,
        },
        {
            $Type : 'UI.DataField',
            Value : date,
            Label : 'Date',
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
            Value : employee_ID,
            Label : 'Kiküldött neve',
        },
        {
            $Type : 'UI.DataField',
            Value : goal,
            Label : 'Kiküldetés célja',
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
        Text : 'Külföldi kiküldetések',
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'General Information',
            ID : 'GeneralInformation',
            Target : '@UI.FieldGroup#GeneralInformation',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Departures and Arrivals',
            ID : 'DeparturesandArrivals',
            Target : 'departures_arrivals/@UI.LineItem#DeparturesandArrivals',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Daily expenses',
            ID : 'Dailyexpenses',
            Target : 'daily_expenses/@UI.LineItem#Dailyexpenses',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Accomodations',
            ID : 'Accomodations',
            Target : 'accomodations/@UI.LineItem#Accomodations',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Material expenses',
            ID : 'Materialexpenses',
            Target : 'material_expenses/@UI.LineItem#Materialexpenses',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Trip expenses',
            ID : 'Tripexpenses',
            Target : 'trip_expenses/@UI.LineItem#Tripexpenses',
        },
    ],
    UI.FieldGroup #GeneralInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : employee_ID,
                Label : 'Employee',
            },
            {
                $Type : 'UI.DataField',
                Value : goal,
                Label : 'Goal',
            },
            {
                $Type : 'UI.DataField',
                Value : country_code,
            },
            {
                $Type : 'UI.DataField',
                Value : travel_to,
                Label : 'Travel to',
            },
            {
                $Type : 'UI.DataField',
                Value : travel_back,
                Label : 'Travel back',
            },
            {
                $Type : 'UI.DataField',
                Value : userEmail,
                Label : 'userEmail',
            },
            {
                $Type : 'UI.DataField',
                Value : serialNumber,
                Label : 'serialNumber',
            },
            {
                $Type : 'UI.DataField',
                Value : borrowedEUR,
                Label : 'borrowedEUR',
            },
            {
                $Type : 'UI.DataField',
                Value : borrowedHUF,
                Label : 'borrowedHUF',
            },
        ],
    },
    UI.HeaderInfo : {
        Title : {
            $Type : 'UI.DataField',
            Value : goal,
        },
        TypeName : '',
        TypeNamePlural : '',
    },
    UI.Identification : [
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'AppService.submitRegular',
            Label : 'Submit',
            Determining : true,
            @UI.Hidden : (not submittable or backOffice or editing) 
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'AppService.unsubmitRegular',
            Label : 'Unsubmit',
            Determining : true,
            @UI.Hidden : ( submittable or backOffice or editing)
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'AppService.rejectRegular',
            Label : 'Reject',
            Determining : true,
            @UI.Hidden : ( submittable or not backOffice or editing )
        },
    ],
    UI.HeaderFacets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Státusz',
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
                Label : 'status_ID',
            },
        ],
    },
    );

annotate service.PostingsRegular with {
    employee @(
        Common.Text : {
            $value : employee.name,
            ![@UI.TextArrangement] : #TextOnly
        },
        Common.FieldControl : #Mandatory,
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

annotate service.Employees with {
    ID @Common.Text : {
        $value : name,
        ![@UI.TextArrangement] : #TextOnly,
    }
};

annotate service.DeparturesAndArrivals with @(
    UI.LineItem #DeparturesandArrivals : [
        {
            $Type : 'UI.DataField',
            Value : from_where,
            Label : 'from_where',
        },
        {
            $Type : 'UI.DataField',
            Value : departure,
            Label : 'departure',
        },
        {
            $Type : 'UI.DataField',
            Value : to_where,
            Label : 'to_where',
        },
        {
            $Type : 'UI.DataField',
            Value : arrival,
            Label : 'arrival',
        },
        {
            $Type : 'UI.DataField',
            Value : meanOfTransport_ID,
            Label : 'Utazás módja',
        },
    ]
);

annotate service.DailyExpenses with @(
    UI.LineItem #Dailyexpenses : [
        {
            $Type : 'UI.DataField',
            Value : date,
            Label : 'date',
        },
        {
            $Type : 'UI.DataField',
            Value : days,
            Label : 'days',
        },
        {
            $Type : 'UI.DataField',
            Value : daily_price,
            Label : 'daily_price',
        },
        {
            $Type : 'UI.DataField',
            Value : currency_code,
        },
        {
            $Type : 'UI.DataField',
            Value : paymentMethod_ID,
            Label : 'paymentMethod_ID',
            
            
            
        },
    ]
);

annotate service.Accomodations with @(
    UI.LineItem #Accomodations : [
        {
            $Type : 'UI.DataField',
            Value : accomodation_name,
            Label : 'accomodation_name',
        },
        {
            $Type : 'UI.DataField',
            Value : date,
            Label : 'date',
        },
        {
            $Type : 'UI.DataField',
            Value : days,
            Label : 'days',
        },
        {
            $Type : 'UI.DataField',
            Value : daily_price,
            Label : 'daily_price',
        },
        {
            $Type : 'UI.DataField',
            Value : currency_code,
        },
        {
            $Type : 'UI.DataField',
            Value : paymentMethod_ID,
            Label : 'paymentMethod_ID',
        },
    ]
);

annotate service.MaterialExpenses with @(
    UI.LineItem #Materialexpenses : [
        {
            $Type : 'UI.DataField',
            Value : reference,
            Label : 'reference',
        },
        {
            $Type : 'UI.DataField',
            Value : date,
            Label : 'date',
        },
        {
            $Type : 'UI.DataField',
            Value : name,
            Label : 'name',
        },
        {
            $Type : 'UI.DataField',
            Value : price,
            Label : 'price',
        },
        {
            $Type : 'UI.DataField',
            Value : currency_code,
        },
        {
            $Type : 'UI.DataField',
            Value : paymentMethod_ID,
            Label : 'paymentMethod_ID',
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
    daily_price @Common.FieldControl : #Mandatory
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
            Label : 'reference',
        },
        {
            $Type : 'UI.DataField',
            Value : posting.trip_expenses.date,
            Label : 'date',
        },
        {
            $Type : 'UI.DataField',
            Value : posting.trip_expenses.name,
            Label : 'name',
        },
        {
            $Type : 'UI.DataField',
            Value : posting.trip_expenses.price,
            Label : 'price',
        },
        {
            $Type : 'UI.DataField',
            Value : currency_code,
        },
        {
            $Type : 'UI.DataField',
            Value : paymentMethod_ID,
            Label : 'paymentMethod_ID',
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
        Common.Label : 'Státusz',
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
)};

annotate service.PostingsWithCar with {
    cylinder_volume @Common.FieldControl : #Optional
};

