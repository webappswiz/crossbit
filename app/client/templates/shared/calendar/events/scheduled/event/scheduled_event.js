var calendarEvent,
	timeRange,

	isEditing = function () {
		return !!Session.get( 'editingCalendarEvent' );
	},

	updateCalendar = function () {
		$( '#calendar' ).fullCalendar( 'refetchEvents' );
	},

	updateCalendarEvent = function ( id, calEvent ) {
		CalendarEvents.update( id, {
			$set: {
				title       : calEvent.title,
				start       : calEvent.start.toDate(),
				end         : calEvent.end.toDate(),
				type        : calEvent.type,
				price       : calEvent.price,
				details     : calEvent.details,
				maxAttendees: calEvent.maxAttendees
			}
		});

		updateCalendar();
	},

	publishCalendarEvent = function ( id ) {
		CalendarEvents.update( id, {
			$set: {
				published: true
			}
		});
	},

	unpublishCalendarEvent = function ( id ) {
		CalendarEvents.update( id, {
			$set: {
				published: false
			}
		});
	},

	cancelCalendarEvent = function ( id ) {
		CalendarEvents.update( id, {
			$set: {
				cancelled: true
			}
		});
	},

	activateCalendarEvent = function ( id ) {
		CalendarEvents.update( id, {
			$set: {
				cancelled: false
			}
		});
	},

	removeCalendarEvent = function ( id ) {
		CalendarEvents.remove({
			_id: id
		});

		updateCalendar();
	},

	attendCalendarEvent = function ( id, userId ) {
		CalendarEvents.update( id, {
			$push: {
				participants: userId
			}
		});
	},

	leaveCalendarEvent = function ( id, userId ) {
		CalendarEvents.update( id, {
			$pull: {
				participants: userId
			}
		});
	},

	hideModal = function () {
		// Trigger the modal bootstrap 3 box as defined in the calendar.html page
		$( '#EditEventModal' ).modal( 'hide' );
	};

Template.scheduledEvent.events({
	'click #saveEvent': function ( event, template ) {
		var update = {
				title       : template.find( '#eventTitle' ).value,
				start       : timeRange.start,
				end         : timeRange.end,
				type        : template.find( '#eventTypeSelect' ).value,
				price       : template.find( '#eventPrice' ).value,
				details     : template.find( '#eventDetails' ).value,
				maxAttendees: template.find( '#maxAttendeesSelect' ).value
			};

		updateCalendarEvent( Session.get( 'editingCalendarEvent' ), update );

		hideModal();
	},

	'click #publishSession': function ( event, template ) {
		if ( calendarEvent.published ) {
			unpublishCalendarEvent( calendarEvent._id );
		} else {
			publishCalendarEvent( calendarEvent._id );
		}

		hideModal();
	},

	'click #cancelSession': function ( event, template ) {
		if ( calendarEvent.cancelled ) {
			activateCalendarEvent( calendarEvent._id );
		} else {
			cancelCalendarEvent( calendarEvent._id );
		}

		hideModal();
	},

	'click #activateSession': function ( event, template ) {
		activateCalendarEvent( calendarEvent._id );

		hideModal();
	},

	'click #deleteSession': function ( event, template ) {
		removeCalendarEvent( calendarEvent._id );

		hideModal();
	},

	'click #cancelEditing': function ( event, template ) {
		hideModal();
	},

	'click #attendSession': function ( event, template ) {
		event.preventDefault();

		if ( Meteor.userId() ) {
			var calEvent = ( calendarEvent ) ? calendarEvent : this;

			if ( $.inArray( Meteor.userId(), calEvent.participants ) > -1 ) {
				leaveCalendarEvent( calEvent._id, Meteor.userId() );
			} else {
				attendCalendarEvent( calEvent._id, Meteor.userId() );
			}
		} else {
			Router.go( '/login' );
		}
	}
});

Template.scheduledEvent.helpers({
	isEditable: function () {
		return isEditing();
	},

	eventId: function () {
		return ( calendarEvent ) ? calendarEvent._id : this._id;
	},

	eventTitle: function () {
		return ( calendarEvent ) ? calendarEvent.title : this.title;
	},

	eventMonth: function () {
		return moment( ( calendarEvent ) ? calendarEvent.start : this.start ).format( 'MMM' );
	},

	eventDay: function () {
		return moment( ( calendarEvent ) ? calendarEvent.start : this.start ).format( 'D' );
	},

	eventTime: function () {
		var calEvent = ( calendarEvent ) ? calendarEvent : this;

		return (
			moment( calEvent.start ).format( 'h:mm A' ) + ' - ' +
			moment( calEvent.end ).format( 'h:mm A' )
		);
	},

	eventType: function () {
		if ( calendarEvent  ) {
			return calendarEvent.type;
		} else {
			if ( this.type == 'group' ) {
				return this.type + ' (' + this.maxAttendees + ')';
			} else {
				return this.type;
			}
		}
	},

	maxAttendees: function () {
		return ( calendarEvent ) ? calendarEvent.maxAttendees : this.maxAttendees;
	},

	eventPrice: function () {
		return ( calendarEvent ) ? calendarEvent.price : this.price;
	},

	detailsPlaceholder: function () {
		return 'To be in a good shape is very important nowadays because our way of life isn\'t so healthy and active. Most of us spend endless hours sitting by the computer and it gives negative results very fast. We think that fitness is a pleasant and useful activity. It helps to be more successful and disciplined.';
	},

	eventDetails: function () {
		return ( calendarEvent ) ? calendarEvent.details : this.details;
	},

	isPublished: function () {
		return ( calendarEvent ) ? calendarEvent.published : this.published;
	},

	isCancelled: function () {
		return ( calendarEvent ) ? calendarEvent.cancelled : this.cancelled;
	},

	publishTitle: function () {
		var calEvent = ( calendarEvent ) ? calendarEvent : this;

		return ( calEvent.published ) ? 'Unpublish' : 'Publish';
	},

	cancelTitle: function () {
		var calEvent = ( calendarEvent ) ? calendarEvent : this;

		return ( calEvent.cancelled ) ? 'Activate' : 'Cancel';
	},

	buttonTitle: function () {
		var calEvent = ( calendarEvent ) ? calendarEvent : this;

		if ( $.inArray( Meteor.userId(), calEvent.participants ) > -1 ) {
			return 'Unsubscribe';
		} else {
			return 'Subscribe';
		}
	}
});

Template.scheduledEvent.created = function () {
	calendarEvent = CalendarEvents.find( Session.get( 'editingCalendarEvent' ) ).fetch()[ 0 ];
},

Template.scheduledEvent.rendered = function () {
	if ( calendarEvent ) {
		var duration, time, hours, minutes,
			$timePickers, $timePickerStart, $timePickerEnd;

		$( '#eventTypeSelect option[value=' + calendarEvent.type +']').attr( 'selected', 'selected' );
		$( '#maxAttendeesSelect option[value=' + calendarEvent.maxAttendees +']').attr( 'selected', 'selected' );

		timeRange = moment.twix( calendarEvent.start, calendarEvent.end );
		duration = timeRange.length();	// ms

		$timePickers = $( '#timePickerStart, #timePickerEnd' );
		$timePickerStart = $( '#timePickerStart' );
		$timePickerEnd = $( '#timePickerEnd' );

		$timePickers.timepicker({
			showSeconds: false,
			showInputs: false
		});

		$timePickerStart.timepicker( 'setTime', calendarEvent.start ).on( 'changeTime.timepicker', function( event ) {
			time = moment( event.time.value, ( event.time.meridian === '' ) ? 'H:mm' : 'h:mm A' );
			timeRange.start.set({ 'hour': time.hours(), 'minutes': time.minutes() });

			$timePickerEnd.timepicker( 'setTime', moment( timeRange.start ).add( duration ).format( 'h:mm A' ) );
		});

		$timePickerEnd.timepicker( 'setTime', calendarEvent.end ).on( 'changeTime.timepicker', function( event ) {
			time = moment( event.time.value, ( event.time.meridian === '' ) ? 'H:mm' : 'h:mm A' );
			timeRange.end.set({ 'hour': time.hours(), 'minute': time.minutes() }) ;

			duration = timeRange.length();
		});
	}
};

Template.scheduledEvent.destroyed = function () {
	calendarEvent = null;
}
