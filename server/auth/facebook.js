var facebookAuth = {
	clientId     : 'your-facebook-app-id-here', // App ID
	clientSecret : 'your-facebook-app-secret-here', // App Secret
	callbackUrl  : 'http://localhost:8080/auth/facebook/callback'
};

var facebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');

module.exports  = function(passport, authRouter) {

	authRouter.get('/facebook', passport.authenticate('facebook', { scope : 'email' }));
	authRouter.get('/facebook/callback', passport.authenticate('facebook', { successRedirect : '/',	failureRedirect : '/' }));

	passport.use(new facebookStrategy({
			clientID: facebookAuth.clientId,
			clientSecret: facebookAuth.clientSecret,
			callbackURL: facebookAuth.callbackUrl,
			profileFields: ['id', 'displayName', 'photos', 'email'],
			passReqToCallback : true
		},
		function(req, token, refreshToken, profile, done) {

			// asynchronous
			process.nextTick(function() {

				console.log("Facebook Login:");
				console.log(profile);

				// check if the user is already logged in
				if (!req.user) {

					User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
						if (err)
							return done(err);

						if (user) {

							// if there is a user id already but no token (user was linked at one point and then removed)
							if (!user.facebook.token) {
								user.facebook.token = token;
								user.facebook.name  = profile.displayName;
								user.name = user.facebook.name;
								user.facebook.photoUrl = profile.photos[0].value || '';
								user.photoUrl = user.facebook.photoUrl;

								user.facebook.email = (profile.emails[0].value || '').toLowerCase();

								user.save(function(err) {
									if (err)
										throw err;
									return done(null, user);
								});
							}

							return done(null, user); // user found, return that user
						} else {
							// if there is no user, create them
							var newUser            = new User();

							newUser.facebook.id    = profile.id;
							newUser.facebook.token = token;
							newUser.facebook.name  = profile.displayName;
							newUser.name = newUser.facebook.name;
							newUser.facebook.photoUrl = profile.photos[0].value || '';
							newUser.photoUrl = newUser.facebook.photoUrl;
							newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();

							newUser.save(function(err) {
								if (err)
									throw err;
								return done(null, newUser);
							});
						}
					});

				} else {
					// user already exists and is logged in, we have to link accounts
					var user            = req.user; // pull the user out of the session

					user.facebook.id    = profile.id;
					user.facebook.token = token;
					user.facebook.name  = profile.displayName;
					user.name = user.facebook.name;
					user.facebook.photoUrl = profile.photos[0].value || '';
					user.photoUrl = user.facebook.photoUrl;
					user.facebook.email = (profile.emails[0].value || '').toLowerCase();

					user.save(function(err) {
						if (err)
							throw err;
						return done(null, user);
					});

				}
			});
		}));
};
