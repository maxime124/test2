var mongoose = require('mongoose'),
	assert =  require('assert');

var Dishes = require('./models/dishes');
var Promotions = require('./models/promotions');
var Leaders = require('./models/leadership');

var url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));

db.once('open',function() {
	console.log("connected correctly to server");


	/*Dishes.create({
	 "name": "Uthapizza",
	 "image": "images/uthapizza.png",
	 "category": "mains",
	 "price": "4.99",
	 "description": "A unique . . .",
	 "comments": [
	 {
	 "rating": 5,
	 "comment": "Imagine all the eatables, living in conFusion!",
	 "author": "John Lemon"
	 },
	 {
	 "rating": 4,
	 "comment": "Sends anyone to heaven, I wish I could get my mother-in-law to eat it!",
	 "author": "Paul McVites"
	 }
	 ]
	 },function(err,dish){
	 console.log(err);
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

	 dish.comments.push({
	 rating: 5,
	 comment: 'aaaa',
	 author: 'bbbb'
	 });

	 dish.save(function(err,dish){
	 if(err) throw err;
	 console.log('Added comment!');
	 console.log(dish);

	 db.collection('dishes').drop(function(){
	 db.close();
	 })
	 })

	 });
	 },
	 3000);
	 });*/

	Leaders.create({
		"name": "Promotion",
		"image": "images/uthapizza.png",
		"designation": "100",
		"abbr" : "ceo",
		"description": "A unique . . ."
	}, function (err, leader) {
		console.log(err);
		if (err) throw err;

		console.log('Dish created');
		console.log(leader);
		var id = leader._id;

		Leaders.findByIdAndUpdate(
			id,
			{
				$set: {
					description: 'Updated Test'
				}
			},
			{
				new: true
			}
		).exec(function (err, leader) {
			if (err) throw err;
			console.log(leader);

			db.collection('leadership').drop(function () {
				db.close();
			})

		});
	});
});