/*****************************************************************************/
/* App: The Global Application Namespace */
/*****************************************************************************/
CB = {
	appName: function () {
		return ( Meteor.isServer ) ? process.env.APP_NAME : ( Meteor.settings && Meteor.settings.public ) ? Meteor.settings.public.appName : 'MyApp';
	}
};
