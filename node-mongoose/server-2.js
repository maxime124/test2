var mongoose = require('mongoose'),
	assert =  require('assert');

var Dishes = require('./models/dishes-1');

var url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));

db.once('open',function(){
	console.log("connected correctly to serve");


	Dishes.create({
		name: 'Uthapizza 2',
		description: 'test'
	},function(err,dish){
		if(err) throw err;

		console.log('Dish created');
		console.log(dish);
		var id = dish._id;

		setTimeout(function(){
			Dishes.findByIdAndUpdate(
				id,
				{
				$set: {
					description: 'Updated Test'
				}},
				{
					new: true
				}
			).exec(function(err,dish){
				if(err) throw err;
				console.log('Updated Dish!');
				console.log(dish);

				db.collection('dishes').drop(function(){
					db.close();
				})
			});
		},
			3000);
	});
});