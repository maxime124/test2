var _ = require('underscore');
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

accountSchema.statics.majPercentage = function() {
	Accounts.find({},function (err,accounts) {
		if (err) throw err;
		var liSomme = 0;
		_.each(accounts,function(acc){
			liSomme += acc.value.value;
		});

		_.each(accounts,function(acc){
			acc.percentage = Math.round((acc.value.value/liSomme)*10000)/100;
			Accounts.findByIdAndUpdate(acc._id,{
					$set: acc
				},
				{},
				function (err,account) {
					if (err) console.log(err,account);
				});
		});
	});
}

var Accounts = mongoose.model('Account',accountSchema);
module.exports = Accounts;