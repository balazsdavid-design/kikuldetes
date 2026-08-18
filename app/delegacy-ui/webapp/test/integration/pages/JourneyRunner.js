sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"delegacy-ui/test/integration/pages/PostingsRegularMain.gen"
], function (JourneyRunner, PostingsRegularMainGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('delegacy-ui') + '/test/flp.html#app-preview',
        pages: {
			onThePostingsRegularMainGenerated: PostingsRegularMainGenerated
        },
        async: true
    });

    return runner;
});

