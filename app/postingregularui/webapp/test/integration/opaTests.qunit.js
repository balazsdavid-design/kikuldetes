sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'postingregularui/test/integration/FirstJourney',
		'postingregularui/test/integration/pages/PostingRegularList',
		'postingregularui/test/integration/pages/PostingRegularObjectPage'
    ],
    function(JourneyRunner, opaJourney, PostingRegularList, PostingRegularObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('postingregularui') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThePostingRegularList: PostingRegularList,
					onThePostingRegularObjectPage: PostingRegularObjectPage
                }
            },
            opaJourney.run
        );
    }
);