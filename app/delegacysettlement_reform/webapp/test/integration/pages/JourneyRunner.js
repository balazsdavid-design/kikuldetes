sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"kikuldetesek/delegacysettlementreform/test/integration/pages/PostingsRegularMain.gen"
], function (JourneyRunner, PostingsRegularMainGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('kikuldetesek/delegacysettlementreform') + '/test/flp.html#app-preview',
        pages: {
			onThePostingsRegularMainGenerated: PostingsRegularMainGenerated
        },
        async: true
    });

    return runner;
});

