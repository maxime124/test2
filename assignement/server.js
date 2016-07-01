var express = require('express');
var morgan = require('morgan');

var hostname = 'localhost';
var port = 3000;

var app = express();

app.use(morgan('dev'));

app.use('/dishes',require('./dishRouter'));
app.use('/promotions',require('./promoRouter'));
app.use('/leadership',require('./leaderRouter'));

app.listen(port,hostname,function(){
	console.log(`Server running at http://${hostname}:${port}`);
});