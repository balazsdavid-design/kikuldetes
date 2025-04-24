sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'adminpanel/test/integration/FirstJourney',
		'adminpanel/test/integration/pages/FuelPricesList',
		'adminpanel/test/integration/pages/FuelPricesObjectPage'
    ],
    function(JourneyRunner, opaJourney, FuelPricesList, FuelPricesObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('adminpanel') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheFuelPricesList: FuelPricesList,
					onTheFuelPricesObjectPage: FuelPricesObjectPage
                }
            },
            opaJourney.run
        );
    }
);