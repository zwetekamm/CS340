module.exports = function(){
	var express = require('express');
	var router = express.Router();

	// Gets all Employees
	function getEmployees(res, mysql, context, complete){
		var sql = "SELECT employees.fname, employees.lname, employees.birthday, resorts.name AS rname, lifts.name AS liname FROM employees INNER JOIN resorts ON employees.resort_id = resorts.id INNER JOIN lifts ON employees.lift_id = lifts.id ORDER BY employees.fname";
		mysql.pool.query(sql, function(err, results, fields){
			if(err){
				res.write(JSON.stringify(err));
				res.end();
			}
			context.employees = results;
			complete();
		});
	}

	//Gets all Resorts
	function getResorts(res, mysql, context, complete){
		var sql = "Select id, name FROM resorts ORDER BY name";
		mysql.pool.query(sql, function(err, results, fields){
			if(err){
				res.write(JSON.stringify(err));
				res.end();
			}
			context.resorts = results;
			complete();
		});
	}

	//Gets all lifts
	function getLifts(res, mysql, context, complete){
		var sql = "SELECT lifts.id, lifts.name, lifts.capacity, lifts.highspeed, resorts.name AS rname FROM lifts INNER JOIN resorts ON lifts.resort_id = resorts.id ORDER BY lifts.name";
		mysql.pool.query(sql, function(err, results, fields){
			if(err){
				res.write(JSON.stringify(err));
				 res.end();
			}
			context.lifts = results;
			complete();
		});
	}

	// Root, which calls getEmployees, getLifts, and getResorts
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		var mysql = req.app.get('mysql');
		getEmployees(res, mysql, context, complete);
		getResorts(res, mysql, context, complete);
		getLifts(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 3){
				res.render('lifts', context);
			}
		}
	});

	// Add Employee
	router.post('/', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO lifts (name, capacity, highspeed, resort_id)VALUES (?,?,?,?)";
		var inserts = [req.body.name, req.body.capacity, req.body.highspeed, req.body.resort];
		sql = mysql.pool.query(sql, inserts, function(err, results, fields){
			if(err){
				console.log(JSON.stringify(err));
				res.write(JSON.stringify(err));
				res.end();
			}else{
				res.redirect('/lifts');
			}
		});
	});

	return router;
}();