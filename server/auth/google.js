var googleAuth = {
	clientId     : 'your-google-client-id-here',
	clientSecret : 'your-google-client-secret-here',
	callbackUrl  : 'http://localhost:8080/auth/google/callback'
};

var googleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/user');

module.exports  = function(passport, authRouter) {

	authRouter.get('/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
	authRouter.get('/google/callback', passport.authenticate('google', { successRedirect : '/',	failureRedirect : '/' }));

	passport.use(new googleStrategy({
			clientID: googleAuth.clientId,
			clientSecret: googleAuth.clientSecret,
			callbackURL: googleAuth.callbackUrl,
			passReqToCallback : true
		},
		function(request, token, refreshToken, profile, done) {

			console.log("Google User:");
			console.log(profile);

			// asynchronous
			process.nextTick(function() {
				// check if the user is already logged in
				if(!request.user) {
					User.findOne({ 'google.id': profile.id }, function(err, user) {
						if(err)
							return done(err);

						if(user) {
							// if there is a user id already but no token (user was linked at one point and then removed)
							if(!user.google.token) {
								user.google.token = token;
								user.google.name = profile.displayName;
								user.name = profile.displayName;
								user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email
								user.google.picture = profile._json['picture'];
								user.photoUrl = profile._json['picture'];

								user.save(function(err) {
									if(err)
										throw err;
									return done(null, user);
								});
							}

							return done(null, user);
						}
						else {
							var newUser = new User();

							newUser.google.id = profile.id;
							newUser.google.token = token;
							newUser.google.name = profile.displayName;
							newUser.name = profile.displayName;
							newUser.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email
							newUser.google.photoUrl = profile._json['picture'];
							newUser.photoUrl = profile._json['picture'];

							newUser.save(function(err) {
								if(err)
									throw err;
								return done(null, newUser);
							});
						}
					});
				}
				else {
					// user already exists and is logged in, we have to link accounts
					var user = request.user; // pull the user out of the session

					user.google.id = profile.id;
					user.google.token = token;
					user.google.name = profile.displayName;
					user.name = profile.displayName;
					user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email
					user.google.photoUrl = profile._json['picture'];
					user.photoUrl = profile._json['picture'];

					user.save(function(err) {
						if(err)
							throw err;
						return done(null, user);
					});
				}
			});
		}));
};
