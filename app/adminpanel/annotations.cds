using AppService as service from '../../srv/services';




annotate service.FuelPrices with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'petrolPrice',
                Value : petrolPrice,
            },
            {
                $Type : 'UI.DataField',
                Label : 'dieselPrice',
                Value : dieselPrice,
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
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : '{i18n>YearMonth}',
            Value : yearMonth,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>PetrolPrice}',
            Value : petrolPrice,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>DieselPrice}',
            Value : dieselPrice,
        },
    ],
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
        Text : '{i18n>FuelPrices}',
    },
    UI.HeaderInfo : {
        Title : {
            $Type : 'UI.DataField',
            Value : yearMonth,
        },
        TypeName : '',
        TypeNamePlural : '',
    },
);

annotate service.FuelConsumptions with @(
    UI.LineItem #tableView : [
        {
            $Type : 'UI.DataField',
            Value : fuelType.name,
            Label : '{i18n>FuelType}',
        },
        {
            $Type : 'UI.DataField',
            Value : volumeStart,
            Label : '{i18n>VolumeStart}',
        },
        {
            $Type : 'UI.DataField',
            Value : volumeEnd,
            Label : '{i18n>VolumeEnd}',
        },
        {
            $Type : 'UI.DataField',
            Value : consumption,
            Label : '{i18n>Consumption}',
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
        Text : '{i18n>FuelConsumptions}',
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'General Information',
            ID : 'GeneralInformation',
            Target : '@UI.FieldGroup#GeneralInformation',
        },
    ],
    UI.FieldGroup #GeneralInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : fuelType_ID,
                Label : 'fuelType_ID',
            },
            {
                $Type : 'UI.DataField',
                Value : volumeStart,
                Label : 'volumeStart',
            },
            {
                $Type : 'UI.DataField',
                Value : volumeEnd,
                Label : 'volumeEnd',
            },
            {
                $Type : 'UI.DataField',
                Value : consumption,
                Label : 'consumption',
            },
        ],
    },
);

annotate service.PaymentMethods with @(
    UI.LineItem #tableView : [
        {
            $Type : 'UI.DataField',
            Value : ID,
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
        Text : '{i18n>PaymentMethods}',
    },
    UI.HeaderInfo : {
        Title : {
            $Type : 'UI.DataField',
            Value : name,
        },
        TypeName : '',
        TypeNamePlural : '',
    },
);

annotate service.MeansOfTransport with @(
    UI.LineItem #tableView : [
        {
            $Type : 'UI.DataField',
            Value : ID,
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
        Text : '{i18n>MeansofTransport}',
    },
    UI.HeaderInfo : {
        Title : {
            $Type : 'UI.DataField',
            Value : name,
        },
        TypeName : '',
        TypeNamePlural : '',
    },
);

annotate service.Countries with @(
    UI.LineItem #tableView : [
        {
            $Type : 'UI.DataField',
            Value : code,
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
        Text : 'Countries',
    },
    UI.HeaderInfo : {
        Title : {
            $Type : 'UI.DataField',
            Value : code,
        },
        TypeName : '',
        TypeNamePlural : '',
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Information',
            ID : 'Information',
            Target : '@UI.FieldGroup#Information',
        },
    ],
    UI.FieldGroup #Information : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : code,
            },
            {
                $Type : 'UI.DataField',
                Value : descr,
            },
            {
                $Type : 'UI.DataField',
                Value : name,
            },
            {
                $Type : 'UI.DataField',
                Value : name,
                Label : 'Locale name',
            },
        ],
    },
);

annotate service.Currencies with @(
    UI.LineItem #tableView : [
        {
            $Type : 'UI.DataField',
            Value : code,
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
        Text : 'Currencies',
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Information',
            ID : 'Information',
            Target : '@UI.FieldGroup#Information',
        },
    ],
    UI.FieldGroup #Information : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : code,
            },
        ],
    },
);

annotate service.FuelConsumptions with {
    fuelType @(Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'FuelTypes',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : fuelType_ID,
                    ValueListProperty : 'ID',
                },
            ],
            Label : 'Fuel type',
        },
        Common.ValueListWithFixedValues : true,
        Common.Text : {
            $value : fuelType.name,
            ![@UI.TextArrangement] : #TextOnly,
        },
)};

annotate service.FuelPrices with {
    petrolPrice @Common.FieldControl : #Mandatory
};

annotate service.FuelPrices with {
    dieselPrice @Common.FieldControl : #Mandatory
};

annotate service.Statuses with @(
    UI.LineItem #tableView : [
        {
            $Type : 'UI.DataField',
            Value : statusText,
            Label : 'Státusz neve',
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
        Text : 'Statuses',
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
            Label : 'Szöveg',
            ID : 'Szveg',
            Target : 'texts/@UI.LineItem#Szveg',
        },
    ],
    UI.FieldGroup #GeneralInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : statusText,
                Label : 'statusText',
            },
            {
                $Type : 'UI.DataField',
                Value : texts.statusText,
                Label : 'statusText',
            },
            {
                $Type : 'UI.DataField',
                Value : texts.locale,
                Label : 'locale',
            },
            {
                $Type : 'UI.DataField',
                Value : ID,
                Label : 'ID',
            },
            {
                $Type : 'UI.DataField',
                Value : texts.ID,
                Label : 'ID',
            },
        ],
    },
);

annotate service.Statuses.texts with @(
    UI.LineItem #Szveg : [
        {
            $Type : 'UI.DataField',
            Value : locale,
            Label : 'locale',
        },
        {
            $Type : 'UI.DataField',
            Value : statusText,
            Label : 'statusText',
        },
    ]
);

annotate service.Statuses with {
    ID @Common.FieldControl : #ReadOnly
};

