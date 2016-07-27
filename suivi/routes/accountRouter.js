var express = require('express');
var HttpStatus = require('http-status-codes');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Accounts = require('../models/accounts');

var accountRouter = express.Router();
accountRouter.use(bodyParser.json());
accountRouter.route('/')
	.post(function(req,res,next){
		Accounts.create(req.body,function(err,account) {
			if(err) throw err;

			var id = account._id;
			res.json(id);
		});
	})
	.get(function(req,res,next){
		Accounts.find({},function (err,account) {
			if (err) throw err;
			res.json(account);
		});
	})
	.delete(function(req,res,next){
		Accounts.remove({},function(err,resp){
			if (err) throw err;
			
			res.json(true);
		})
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

			if(account.history.id(req.params.valueId) && req.body.value && req.body.date && req.body.composition) {
				account.history.id(req.params.valueId).value = req.body.value;
				account.history.id(req.params.valueId).date = req.body.date;
				account.history.id(req.params.valueId).composition = req.body.composition;

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

accountRouter.route('/:accountId/history/:valueId/composition')
	.get(function(req,res,next) {
		Accounts.findById(req.params.accountId,function(err,account) {
			if (err) throw err;
			res.json(account.history.id(req.params.valueId).composition);
		})
	});

module.exports = accountRouter;