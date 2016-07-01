var mongoose = require('mongoose'),
	assert =  require('assert');

var Dishes = require('./models/dishes-1');

var url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
	console.log("connected correctly to serve");

	var newDish = Dishes({
		name: 'Uthapizza',
		description: 'test'
	});

	newDish.save(function(err) {
		if(err) throw err;
		console.log('Dish created');

		Dishes.find({},function(err,dishes){
			if(err) throw err;
			console.log(dishes);

			db.collection('dishes').drop(function(err){
				db.close();
			});
		});
	})
});