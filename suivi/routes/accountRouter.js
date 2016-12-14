var express = require('express');
var HttpStatus = require('http-status-codes');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var _ = require('underscore');

var Accounts = require('../models/accounts');

var accountRouter = express.Router();
accountRouter.use(function(req, res, next){
	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');

	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware
	next();
});
accountRouter.use(bodyParser.json());

accountRouter.route('/')
	.post(function(req,res,next){
		Accounts.create(req.body,function(err,account) {
			if(err) throw err;

			Accounts.majPercentage();
			var id = account._id;
			res.json(id);
		});
	})
	.get(function(req,res,next){
		Accounts.find({},function (err,account) {
			if (err) throw err;
			res.json(account);
		}).sort('-value.value');
	})
	.delete(function(req,res,next){
		Accounts.remove({},function(err,resp){
			if (err) throw err;
			
			res.json(true);
		})
	});

accountRouter.route('/sold')
	.get(function(req,res,next) {
		Accounts.find({},function(err,accounts) {
			if (err) throw err;
			if(accounts.length) {
				var liSold = 0;
				for(var i=0;i<accounts.length;i++) {
					liSold += accounts[i].value.value;
				}
				liSold = liSold / 100;
				res.json(liSold.toFixed(2));
			}
		 });
	});

accountRouter.route('/:accountId')
	.get(function(req,res,next){
		Accounts.findById(req.params.accountId,function (err,account) {
			if (err) throw err;
			if (account) {
				res.json(account);
			}
			else {
				res.json(false);
			}
		});
	})
	.put(function(req,res,next){
		Accounts.findByIdAndUpdate(req.params.accountId,{
				$set: req.body
			},
			{
				new: true
			},
			function (err,account) {
				if (err) throw err;
				res.json(account);
			}
		);
	})
	.delete(function(req,res,next) {
		Accounts.findByIdAndRemove(req.params.accountId,function(err,resp){
			if (err) throw err;

			if (resp && resp._id && resp._id == req.params.accountId) {
				Accounts.majPercentage();
				res.json(resp);
			}
			else {
				res.json(false);
			}
		})
	});


accountRouter.route('/:accountId/history')
	.get(function(req,res,next) {
		Accounts.findById(req.params.accountId,function(err,account) {
			if (err) throw err;

			res.json(account.history);
		})
	})
	.post(function(req,res,next){
		Accounts.findById(req.params.accountId,function(err,account){
			if (err) throw err;

			account.history.push(req.body);

			account.save(function(err,account) {
				if (err) throw err;
				res.json(account);
			});
		});
	})
	.delete(function(req,res,next) {
		Accounts.findById(req.params.accountId,function (err,account) {
			if(err) throw err;
			for (var i = (account.history.length -1); i >= 0;i--) {
				account.history.id(account.history[i]._id).remove();
			}

			account.save(function(err,result) {
				if (err) throw err;
				res.json(account);
			});
		})
	});


accountRouter.route('/:accountId/history/:valueId')
	.get(function(req,res,next) {
		Accounts.findById(req.params.accountId,function(err,account) {
			if (err) throw err;
			res.json(account.history.id(req.params.valueId));
		})
	})
	.put(function(req,res,next){
		Accounts.findById(req.params.accountId,function(err,account){
			if (err) throw err;

			if(account.history.id(req.params.valueId) && req.body.value &&  req.body.date) {
				account.history.id(req.params.valueId).value = req.body.value;
				account.history.id(req.params.valueId).date = req.body.date;

				account.save(function(err,account) {
					if (err) throw err;
					res.json(account);
				});
			}
			else {
				res.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.send({
					error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
				});
			}
		});
	})
	.delete(function(req,res,next) {
		Accounts.findById(req.params.accountId,function (err,account) {
			if(err) throw err;

			account.history.id(req.params.valueId).remove();
			account.save(function(err,resp) {
				if (err) throw err;
				res.json(resp);
			});
		})
	});

//Manage value evolution
accountRouter.route('/:accountId/value')
	.post(function(req,res,next){
		Accounts.findById(req.params.accountId,function(err,account){
			if (err) throw err;
			//Save previous value into the history
			var loLastValue = account.value;
			account.history.push(loLastValue);

			//Add the new value
			account.value = req.body;

			//Save account
			account.save(function(err,account) {
				if (err) throw err;
				res.json(account);
			});
		});
	});

//Get account evolution since a given date
accountRouter.route('/:accountId/value/:date')
	.get(function(req,res,next){
		Accounts.findById(req.params.accountId,function(err,account){
			if (err) throw err;
			//Save previous value into the history
			var loLastValue = account.value;
			account.history.push(loLastValue);

			//Add the new value
			account.value = req.body;

			//Save account
			account.save(function(err,account) {
				if (err) throw err;
				res.json(account);
			});
		});
	});
module.exports = accountRouter;