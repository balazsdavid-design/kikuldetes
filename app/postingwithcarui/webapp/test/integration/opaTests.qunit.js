sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'postingwithcarui/test/integration/FirstJourney',
		'postingwithcarui/test/integration/pages/PostingWithCarList',
		'postingwithcarui/test/integration/pages/PostingWithCarObjectPage'
    ],
    function(JourneyRunner, opaJourney, PostingWithCarList, PostingWithCarObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('postingwithcarui') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThePostingWithCarList: PostingWithCarList,
					onThePostingWithCarObjectPage: PostingWithCarObjectPage
                }
            },
            opaJourney.run
        );
    }
);