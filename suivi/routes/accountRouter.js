var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Accounts = require('../models/accounts');

var accountRouter = express.Router();
accountRouter.use(bodyParser.json());
accountRouter.route('/')
	.post(function(req,res,next){
		Accounts.create(req.body,function(err,account) {
			if(err) throw err;

			console.log('New account created!');
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

	/*
	.delete(function(req,res,next) {
		Dishes.findById(req.parmas.dishId,function (err,dish) {
			if(err) throw err;
			for (var i = (dish.comments.length -1); i >= 0;i--) {
				dish.comments.id(dish.comments[i]._id).remove();
			}

			dish.save(function(err,result) {
				if (err) throw err;
				res.writeHead(200,{
					'Content-Type': 'text/plain'
				});
				res.end('Deleted all comments!');
			});
		})
	});

dishRouter.route('/:dishId/comments/:commentId')
	.get(function(req,res,next) {
		Dishes.findById(req.params.dishId,function(err,dish) {
			if (err) throw err;
			res.json(dish.comments.id(req.params.commentId));
		})
	})
	.put(function(req,res,next){
		Dishes.findById(req.params.dishId,function(err,dish){
			if (err) throw err;

			dish.comments.id(req.params.commentId).remove();
			dish.comments.push(req.body);

			dish.save(function(err,dish) {
				if (err) throw err;
				console.log('Updated comments');
				res.json(dish);
			});
		});
	})
	.delete(function(req,res,next) {
		Dishes.findById(req.parmas.dishId,function (err,dish) {
			if(err) throw err;

			dish.comments.id(req.parmas.commentId).remove();
			dish.save(function(err,resp) {
				if (err) throw err;
				res.json(resp);
			});
		})
	});
*/
module.exports = accountRouter;