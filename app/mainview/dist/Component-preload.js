//@ui5-bundle mainview/Component-preload.js
sap.ui.require.preload({
	"mainview/Component.js":function(){
sap.ui.define(["sap/ui/core/UIComponent","mainview/model/models"],(e,i)=>{"use strict";return e.extend("mainview.Component",{metadata:{manifest:"json",interfaces:["sap.ui.core.IAsyncContentCreation"]},init(){e.prototype.init.apply(this,arguments);this.setModel(i.createDeviceModel(),"device");this.getRouter().initialize()}})});
},
	"mainview/controller/App.controller.js":function(){
sap.ui.define(["sap/ui/core/mvc/Controller"],e=>{"use strict";return e.extend("mainview.controller.App",{onInit(){}})});
},
	"mainview/controller/MainView.controller.js":function(){
sap.ui.define(["sap/ui/core/mvc/Controller"],e=>{"use strict";return e.extend("mainview.controller.MainView",{onInit(){}})});
},
	"mainview/i18n/i18n.properties":'# This is the resource bundle for mainview\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Main View for Application\n\n#YDES: Application description\nappDescription=An SAP Fiori application.\n#XTIT: Main view title\ntitle=Main View for Application',
	"mainview/manifest.json":'{"_version":"1.65.0","sap.app":{"id":"mainview","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap/generator-fiori:basic","version":"1.16.3","toolsId":"a3d09216-1142-4c01-ac9c-75b21805a820"},"dataSources":{"mainService":{"uri":"odata/v4/app/","type":"OData","settings":{"annotations":[],"odataVersion":"4.0"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"dependencies":{"minUI5Version":"1.132.1","libs":{"sap.m":{},"sap.ui.core":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"mainview.i18n.i18n"}},"":{"dataSource":"mainService","preload":true,"settings":{"operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","controlAggregation":"pages","controlId":"app","transition":"slide","type":"View","viewType":"XML","path":"mainview.view"},"routes":[{"name":"RouteMainView","pattern":":?query:","target":["TargetMainView"]}],"targets":{"TargetMainView":{"id":"MainView","name":"MainView"}}},"rootView":{"viewName":"mainview.view.App","type":"XML","id":"App"}},"sap.cloud":{"public":true,"service":"kikuld_router"}}',
	"mainview/model/models.js":function(){
sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"mainview/view/App.view.xml":'<mvc:View controllerName="mainview.controller.App"\n    displayBlock="true"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns="sap.m"><App id="app"></App></mvc:View>',
	"mainview/view/MainView.view.xml":'<mvc:View controllerName="mainview.controller.MainView"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns="sap.m"><Page id="page" title="{i18n>title}"></Page></mvc:View>'
});
//# sourceMappingURL=Component-preload.js.map
