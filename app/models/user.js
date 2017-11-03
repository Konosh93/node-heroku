var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../../config').secret;


var userSchema = new mongoose.Schema({
	username: {type: String, lowercase: true, unique: true, required:[true, "can't be empty"], match: [/^[a-zA-Z0-9]+$/, 'invalid username']},
	//email: {type: String, lowercase: true, unique: true, required:[true, "can't be blank"], match:[/\S+@\S+\.\S+/, 'invalid email']},
	hash: String,
	salt: String,
}, {timestamps: true});

userSchema.plugin(uniqueValidator, {message: 'is already taken'});

userSchema.methods.setPassword = function(password){
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
}

userSchema.methods.validPassword = function(password){
	hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
	return hash === this.hash;
}

module.exports = mongoose.model('User', userSchema);