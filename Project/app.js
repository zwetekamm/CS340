var http = require('http');
var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 5085);

app.get('/', function(req, res) {
	res.sendFile(__dirname+"/index.html");
});

app.get('/index.html', function(req, res) {
	res.sendFile(__dirname+"/index.html");
});

app.get('/resorts.html', function(req, res) {
	res.sendFile(__dirname+"/resorts.html");
});

app.get('/lifts.html', function(req, res) {
	res.sendFile(__dirname+"/lifts.html");
});

app.get('/employees.html', function(req, res) {
	res.sendFile(__dirname+"/employees.html");
});

app.get('/roles.html', function(req, res) {
	res.sendFile(__dirname+"/roles.html");
});

app.get('/daily_assignment.html', function(req, res) {
	res.sendFile(__dirname+"/daily_assignment.html");
});

app.use(function(req, res) {
	res.status(404);
	res.render('404');
});

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on flip3.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});
