using AppService as service from '../../srv/services';
annotate service.PostingsRegular with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'Employee',
                Value : employee_ID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Employer',
                Value : employer_ID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'country_code',
                Value : country_code,
            },
            {
                $Type : 'UI.DataField',
                Label : 'goal',
                Value : goal,
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
            Label : 'Departures and arrivals',
            ID : 'Departuresandarrivals',
            Target : 'departures_arrivals/@UI.LineItem#Departuresandarrivals',
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
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'employee_ID',
            Value : employee_ID,
        },
        {
            $Type : 'UI.DataField',
            Label : 'employer_ID',
            Value : employer_ID,
        },
        {
            $Type : 'UI.DataField',
            Label : 'goal',
            Value : goal,
        },
    ],
    UI.HeaderInfo : {
        TypeName : 'Posting',
        TypeNamePlural : '',
    },
);

annotate service.PostingsRegular with {
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
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'employer',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'address',
                },
            ],
        },
        Common.Text : {
            $value : employee.name,
            ![@UI.TextArrangement] : #TextOnly
        },
    )
};

annotate service.PostingsRegular with {
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

annotate service.DeparturesAndArrivals with @(
    UI.LineItem #Departuresandarrivals : [
        {
            $Type : 'UI.DataField',
            Value : from_where,
            Label : 'from_where',
        },
        {
            $Type : 'UI.DataField',
            Value : arrival,
            Label : 'arrival',
        },
        {
            $Type : 'UI.DataField',
            Value : to_where,
            Label : 'to_where',
        },
        {
            $Type : 'UI.DataField',
            Value : departure,
            Label : 'departure',
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
            Value : currency,
            Label : 'currency',
        },
        {
            $Type : 'UI.DataField',
            Value : daily_price,
            Label : 'daily_price',
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
            Value : days,
            Label : 'days',
        },
        {
            $Type : 'UI.DataField',
            Value : currency,
            Label : 'currency',
        },
        {
            $Type : 'UI.DataField',
            Value : daily_price,
            Label : 'daily_price',
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
            Value : currency,
            Label : 'currency',
        },
        {
            $Type : 'UI.DataField',
            Value : price,
            Label : 'price',
        },
    ]
);

