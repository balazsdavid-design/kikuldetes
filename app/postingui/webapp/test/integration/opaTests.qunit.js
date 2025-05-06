sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'postingui/test/integration/FirstJourney',
		'postingui/test/integration/pages/PostingWithCarList',
		'postingui/test/integration/pages/PostingWithCarObjectPage'
    ],
    function(JourneyRunner, opaJourney, PostingWithCarList, PostingWithCarObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('postingui') + '/index.html'
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