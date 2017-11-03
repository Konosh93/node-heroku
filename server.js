var express = require('express'),
	port = process.env.PORT || 3000,
 	passport = require('passport'),
 	bodyParser = require('body-parser'),
 	morgan = require('morgan'),
 	cors = require('cors'),
 	session = require('express-session'),
 	mongoose = require('mongoose'),
 	configDB = require('./config/database.js'),
 	flash = require('connect-flash'),
 	MongoStore = require('connect-mongo')(session);


mongoose.connect(configDB.url);

var app = express();


app.use(morgan('dev'));
app.use(cors())
app.use(session({
	secret: 'test',
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));
app.use(bodyParser.urlencoded({extended:false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())

app.use(function(req,res,next){
	if (req.session) {logger(req.session)}
	next();
})


app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');

require('./app/routes.js')(app, passport);
require('./config/passport.js')(passport);

app.listen(port, () => {
	console.log('	Listening at port ' + port);
})


function logger (data) {
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
	console.log(data);
	console.log('VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
}