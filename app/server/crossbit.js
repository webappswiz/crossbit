/*****************************************************************************/
/* Server App Namespace  */
/*****************************************************************************/

_.extend( CB, {
	init: function () {
		// Accounts.custom.onCreateUser = function ( options, newUser ) {
		// 	var newProfile = {
		// 		name        : newUser.profile.firstName + ' ' + newUser.profile.lastName,
		// 		title       : newUser.profile.headline,
		// 		groups      : [ 'UducateMe' ],
		// 		appointments: {
		// 			availability: {
		// 				Monday: {
		// 					start: 8,
		// 					end  : 16
		// 				},
		// 				Tuesday: {
		// 					start: 8,
		// 					end  : 16
		// 				},
		// 				Wednesday: {
		// 					start: 8,
		// 					end  : 16
		// 				},
		// 				Thursday: {
		// 					start: 8,
		// 					end  : 16
		// 				},
		// 				Friday: {
		// 					start: 8,
		// 					end  : 16
		// 				},
		// 				Saturday: {},
		// 				Sunday  : {}
		// 			}
		// 		}
		// 	};

		// 	newUser.profile = _.defaults( newUser.profile, newProfile );

		// 	return newUser;
		// };

		Accounts.custom.validateNewUser = function ( newUser ) {
			newUser.profile.pictureUrl = Avatar.getUrl( newUser );

			return newUser;
		}
	},

	emails: {
		send: function ( options ) {
			Meteor.call( 'Email.send', options );
		},

		sendSessionInvitation: function ( invitation ) {
			var emailOptions = {
					from   : 'crossbit@webappsconsult.com',
					subject: '[CrossBit] You\'re invited!'
				},
				data = {
					invitationId: invitation._id,
					inviter     : Meteor.users.findOne( invitation.inviter ),
					invitee     : Meteor.users.findOne( invitation.invitee ),
					subject     : invitation.subject,
					info        : invitation.info
				},
				templateName = 'templates/email/email_session_invitation.html',
				template;

			if ( invitation.status == 'invited' ) {
				try {
					template = Assets.getText( templateName );
				} catch ( error ) {
					// No template!
					console.error( '[Send Invitation] Error: Couldn\'t find template "%s"', templateName );
				}

				if ( template ) {
					if ( !Template.sessionInvitation ) {
						SSR.compileTemplate( 'sessionInvitation', template );

						Template.sessionInvitation.helpers({
							absoluteUrl: function () {
								return Meteor.absoluteUrl();
							},

							linkUrl: function () {
								return Meteor.absoluteUrl( 'accept-invitation/' + data.invitationId );
							}
						});
					}

					emailOptions.html = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n' +
						SSR.render( 'sessionInvitation', data );

					if ( emailOptions.html ) {
						emailOptions.to = data.invitee.emails[ 0 ].address;

						CB.emails.send( emailOptions );
					}
				}
			}
		},

		sendSessionAcceptance: function ( invitation ) {
			var emailOptions = {
					from   : 'crossbit@webappsconsult.com',
					subject: '[CrossBit] Your invitation has been accepted!'
				},
				timeSlot = moment( invitation.timeSlot.start )
							.utc().utcOffset( invitation.timeSlot.utcOffset )
							.format( 'dddd, MMMM Do YYYY, h:mm:ss a' ),
				data = {
					invitationId: invitation._id,
					timeSlot    : timeSlot,
					inviter     : Meteor.users.findOne( invitation.inviter ),
					invitee     : Meteor.users.findOne( invitation.invitee ),
					subject     : invitation.subject,
					info        : invitation.info
				},
				templateName = 'templates/email/email_session_acceptance.html',
				template;

			if ( invitation.status == 'accepted' ) {
				try {
					template = Assets.getText( templateName );
				} catch ( error ) {
					// No template!
					console.error( '[Send Invitation] Error: Couldn\'t find template "%s"', templateName );
				}

				if ( template ) {
					if ( !Template.sessionAcceptance ) {
						SSR.compileTemplate( 'sessionAcceptance', template );

						Template.sessionAcceptance.helpers({
							absoluteUrl: function () {
								return Meteor.absoluteUrl();
							},

							linkUrl: function () {
								return Meteor.absoluteUrl( 'invitation-accepted/' + data.invitationId );
							}
						});
					}

					emailOptions.html = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n' +
						SSR.render( 'sessionAcceptance', data );

					if ( emailOptions.html ) {
						emailOptions.to = data.inviter.emails[ 0 ].address;

						CB.emails.send( emailOptions );
					}
				}
			}
		}
	}
});

CB.init();
