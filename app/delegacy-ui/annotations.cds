using AppService as service from '../../srv/services';

// Custom-page-only annotations.
// The shared Object Page annotations stay in app/postingui/annotations.cds.
// Unique qualifiers are used here so CAP does not get duplicate assignments
// when both Fiori apps are loaded into the same CDS model.

annotate service.PostingsWithCar with @(
    UI.LineItem #Main : [
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
        {
            $Type : 'UI.DataField',
            Value : serialNumber,
            Label : '{i18n>SerialNumber}',
        },
    ],

    UI.PresentationVariant #Main : {
        Visualizations : ['@UI.LineItem#Main'],
        SortOrder : [{ Property : createdAt, Descending : true }],
    },

    UI.SelectionFields #MainFilters : [
        employee_ID,
        status_ID,
    ],
);


annotate service.PostingsRegular with {
    employee @Common.Label : '{i18n>Posted}';

    status @Common.Label : '{i18n>Status}';

};

annotate service.PostingsRegular with @(
    UI.LineItem #Main : [
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
        {
            $Type : 'UI.DataField',
            Value : serialNumber,
            Label : '{i18n>SerialNumber}',
        },
    ],

    UI.PresentationVariant #Main : {
        Visualizations : ['@UI.LineItem#Main'],
        SortOrder : [{ Property : createdAt, Descending : true }],
    },

    UI.SelectionFields #MainFilters : [
        employee_ID,
        status_ID,
    ],
);
