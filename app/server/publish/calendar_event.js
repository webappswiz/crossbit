Meteor.publish( 'calendarEvents', function () {
	return CalendarEvents.find({});
});
