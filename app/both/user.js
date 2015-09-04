/*****************************************************************************/
/* Common App Namespace  */
/*****************************************************************************/
_.extend( CB, {
	user: {
		isTrainer: function ( userId ) {
			var users = Meteor.users.find({
					_id: userId
				}).fetch();

			if ( users.length && users[ 0 ].profile ) {
				return users[ 0 ].profile.isTrainer;
			}

			return false;
		}
	}
});
