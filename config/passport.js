var User = require('../app/models/user.js')
var LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport) {

	passport.serializeUser(function(user, done){
		done(null, user.id)
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password',
			passReqToCallback: true,
		},
		function(req, username, password, done){
			process.nextTick( function(){
				User.findOne({'username': username}, function(err, user){
					if (err) {
						return done(err);
					}
					if (user) {
						return done(null, false, req.flash('signupMessage', 'This username has already been used!'));
					}else{
						var user = new User();
						user.username = username;
						user.username = username,
						user.setPassword(password)
						user.save(function(err, user){
							if (err) {
								throw err;
							}
							return done(null, user);
						})
					}
				})				
			})
		}
	));

passport.use('local-login', new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password',
			passReqToCallback: true,
		},
		function(req, username, password, done){
			process.nextTick( function(){
				User.findOne({'username': username}, function(err, user){
					if (err) {
						return done(err);
					}
					if (!user) {
						return done(null, false, req.flash('loginMessage', 'No user found!'));
					}
					if (user.password !== password) {
						return done(null, false, req.flash('loginMessage', 'Incorrect password!'));
					}
					return done(null, user, req.flash('loginMessage', 'Hi '+ user.username));
				})				
			})
		}
	));
	
}