module.exports = function(passport, authRouter, User) {

	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	authRouter.get('/logout', function(request, response) {
		request.logout();
		response.redirect('/');
	});

	return {
		requireLogin: function(request, response, next) {
			if (!request.isAuthenticated()) {
				response.send(401);
			}
			else {
				next();
			}
		}
	};
};