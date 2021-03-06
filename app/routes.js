var User = require('./models/user.js')

module.exports = function(app, passport) {
	app.get('/', function(req,res){
		res.render('index.ejs', {message: "Hi there,"});
	});

	app.get('/signup', function(req, res){
		res.render('signup.ejs',{message: req.flash('signupMessage')});
	});
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true,
	}))


	app.get('/login', function(req, res){
		res.render('login.ejs',{message: req.flash('loginMessage')});
	});
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true,
	}))

	app.get('/profile', isLoggedIn, function(req, res){
		res.render('profile.ejs', {message: 'Hello '+req.user.username})
	})

	app.get('/logout', isLoggedIn, function(req, res){
		req.logout();
		res.redirect('/');
	})

}

function isLoggedIn(req, res, next){
	if (req.isAuthenticated) {
		return next();
	}
	res.redirect('/login')
}