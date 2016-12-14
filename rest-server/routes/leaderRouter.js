var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Leaders = require('../models/leadership');

var leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());
leaderRouter.route('/')
	.get(function(req,res,next){
		Leaders.find({},function (err,lead) {
			if (err) throw err;
			res.json(lead);
		});
	})
	.post(function(req,res,next){
		Leaders.create(req.body,function(err,lead) {
			if(err) throw err;

			console.log('Lead created!');
			var id = lead._id;
			res.writeHead(200,{
				'Content-type': 'text/plain'
			});

			res.end('Added the dish with id: ' + id);
		});
	})
	.delete(function(req,res,next){
		Leaders.find({},function (err,lead) {
			if (err) throw err;
			res.json(lead);
		});
	});

leaderRouter.route('/:leaderId')
	.get(function(req,res,next){
		Leaders.findById(req.params.leaderId,function (err,lead) {
			if (err) throw err;
			res.json(lead);
		});
	})
	.put(function(req,res,next){
		Leaders.findByIdAndUpdate(req.params.leaderId,{
				$set: req.body
			},
			{
				new: true
			},
			function (err,lead) {
				if (err) throw err;
				res.json(lead);
			}
		);
	})
	.delete(function(req,res,next) {
		Leaders.remove(req.params.leaderId,function(err,resp){
			if (err) throw err;
			res.json(resp);
		})
	});

module.exports = leaderRouter;