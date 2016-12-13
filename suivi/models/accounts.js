var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var paymentSchema = new Schema({
	type: {
		type: String,
		default: 'occasional'
	},
	value : {
		type: Currency,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

var accountValueTypeSchema = new Schema({
	type: {
		type:String,
		required: true
	},
	percentage: {
		type:Number
	}
});

var accountValueSchema = new Schema({
	date: {
		type: Date,
		default: Date.now
	},
	value: {
		type: Currency,
		required: true
	},
	composition: [accountValueTypeSchema]
});

var accountSchema = new Schema({
	name:{
		type: String,
		required: true,
		unique: true
	},
	description: {
		type: String
	},
	value: {
		type:accountValueSchema,
		required: true
	},
	history: [accountValueSchema],
	payment: [paymentSchema],
	percentage: {
		type:Number
	}
}, {
	timestamps: true
});

var Accounts = mongoose.model('Account',accountSchema);
module.exports = Accounts;