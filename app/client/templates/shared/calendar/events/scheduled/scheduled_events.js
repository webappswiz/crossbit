var routeController,
	userForProfile = function () {
		var userId = routeController.state.get( 'userId' );

		if ( userId ) {
			return Meteor.users.findOne({
				_id: userId
			});
		} else {
			return Meteor.user();
		}
	},

	isMyProfile = function () {
		var user = userForProfile();

		return ( user && ( user._id === Meteor.userId() ) );
	},

	maxListedEvents = 4,
	filterFor,
	eventFilter;

Template.scheduledEvents.helpers({
	scheduledEvents: function () {
		var user = userForProfile();

		if ( user ) {
			return CalendarEvents.find( eventFilter, {
				owner: user._id,
				start: {
					$gte: new Date()
				},
				sort     : {
					start: 0
				},
				/*
				skip     : Number,*/
				limit    : maxListedEvents/*,
				fields   : Field specifier,
				reactive : Boolean,
				transform: Function
				*/
			});
		}
	},

	canLoadMore: function () {
		return ( CalendarEvents.find( eventFilter ).count() > maxListedEvents );
	}
});

/*****************************************************************************/
/* Profile: Lifecycle Hooks */
/*****************************************************************************/
Template.scheduledEvents.onCreated( function () {
	routeController = Iron.controller(),
	profileUser = userForProfile();

	filterFor = {
		trainer: {
			// Show sessions trainer scheduled
			owner: ( profileUser ) ? profileUser._id : null
		},
		myself: {
			// Show sessions I've joined
			participants: Meteor.userId(),
			published: true
		},
		other: {
			// Show sessions other joined
			participants: ( profileUser ) ? profileUser._id : null,
			published: true
		}
	};

	eventFilter = filterFor.myself;

	if ( !isMyProfile() && profileUser ) {
		if ( CB.user.isTrainer( profileUser._id ) ) {
			eventFilter = filterFor.trainer;
			eventFilter.published = true;
		} else {
			eventFilter = filterFor.other;
		}
	}
});

Template.scheduledEvents.onRendered( function () {
	// CB.build.accordion();
});

Template.scheduledEvents.onDestroyed( function () {
});
