Router.route( '/', {
	name      : 'home',
	template  : 'home',
	controller: 'HomeController',
	where     : 'client'
});

Router.route( '/trainers', {
	name      : 'trainers',
	template  : 'trainers',
	controller: 'HomeController',
	where     : 'client'
});

Router.route( '/signup', {
	name      : 'signup',
	template  : 'account',
	controller: 'AccountController',
	where     : 'client'
});

Router.route( '/login', {
	name      : 'login',
	template  : 'account',
	controller: 'AccountController',
	where     : 'client'
});

Router.route( '/account', {
	name      : 'account',
	template  : 'account',
	controller: 'AccountController',
	where     : 'client'
});

Router.route( '/reset-password/:token', {
	name      : 'resetPassword',
	template  : 'account',
	controller: 'AccountController',
	where     : 'client'
});

Router.route( '/enroll-account/:token', {
	name      : 'enrollAccount',
	template  : 'account',
	controller: 'AccountController',
	where     : 'client'
});

Router.route( '/verify-email/:token', {
	name      : 'verifyEmail',
	template  : 'account',
	controller: 'AccountController',
	where     : 'client'
});

Router.route( '/profile', {
	name      : 'myProfile',
	template  : 'profile',
	controller: 'AccountController',
	where     : 'client',
	yieldRegions: {
		'profile': {
			to: 'content'
		}
	},

	action: function () {
		this.state.set( 'userId', Meteor.userId() );

		this.render();
	}
});

Router.route( '/profile/:userId', {
	name      : 'profile',
	template  : 'profile',
	controller: 'AccountController',
	where     : 'client',
	yieldRegions: {
		'profile': {
			to: 'content'
		}
	},

	action: function () {
		this.state.set( 'userId', this.params.userId );

		this.render();
	}
});

// Redirect all unknown routes to home
Router.route( '/(.*)', {
	onBeforeAction: function () {
		if ( Meteor.userId() ) {
			this.redirect( 'profile' );
		} else {
			this.redirect( 'home' );
		}
	}
});
