using AppService as service from '../../srv/services';
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
            Label : 'employee_ID',
            Value : employee_ID,
        },
        {
            $Type : 'UI.DataField',
            Label : 'employer_ID',
            Value : employer_ID,
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
                Value : data.fuel_expenses,
                Label : 'fuel_expenses',
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
                Value : data.norm_expenses,
                Label : 'norm_expenses',
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
                ![@UI.Hidden] : (NOT fuel_type.ICE),
            },
            {
                $Type : 'UI.DataField',
                Value : fuel_consumption,
                Label : 'fuel_consumption',
            },
            {
                $Type : 'UI.DataField',
                Value : amortization,
                Label : 'amortization',
            },
            {
                $Type : 'UI.DataField',
                Value : fuel_price,
                Label : 'fuel_price',
            },
        ],
    },
    UI.ConnectedFields #connected : {
        $Type : 'UI.ConnectedFieldsType',
        Template : '{fuel_type_ID}!=elektromos{cylinder_volume}',
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
    UI.HeaderInfo : {
        TypeName : 'Posting with car',
        TypeNamePlural : '',
        Title : {
            $Type : 'UI.DataField',
            Value : goal,
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
            Value : currency,
            Label : 'Currency',
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
    )
};

annotate service.FuelTypes with @(
    Communication.Contact #contact : {
        $Type : 'Communication.ContactType',
        fn : name,
    }
);

