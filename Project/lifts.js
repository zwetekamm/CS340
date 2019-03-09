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

	// Gets one lift for the purpose of updating
	function getLift(res, mysql, context, id, complete){
		var sql = "SELECT id, name, capacity, highspeed, resort_id FROM lifts WHERE id=?";
		var inserts = [id];
		mysql.pool.query(sql, inserts, function(err, results, fields){
			if(err){
				res.write(JSON.stringify(err));
				res.end();
			}
			context.lifts = results[0];
			complete();
		})
	}
	// Root, which calls getEmployees, getLifts, and getResorts
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		var mysql = req.app.get('mysql');
		context.jsscripts = ["editLifts.js"];
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

	router.get('/:id', function(req, res){
		callbackCount = 0;
		var context = {};
		context.jsscripts = ["editLifts.js"];
		var mysql = req.app.get('mysql');
		getLift(res, mysql, context, req.params.id, complete);
		getResorts(res, mysql, context, complete);
		function complete(){
			callbackCount++; 	
			if(callbackCount >= 2){
				res.render('update-lift', context);
			}
		}

	});

		router.post('/:id', function(req, res){
		var mysql = req.app.get('mysql');
		console.log(req.body);
		console.log(req.params.id);
		var sql = "UPDATE lifts SET name=?, capacity=?, highspeed=?, resort_id=? WHERE lifts.id=?";
		var inserts = [req.body.name, req.body.capacity, req.body.highspeed, req.body.resort, req.params.id];
		sql = mysql.pool.query(sql, inserts, function(err, results, fields){
			if(err){
				console.log(err);
				res.write(JSON.stringify(err));
				res.end();
			} else{
				res.redirect('/lifts');
				res.status(200);
				res.end();
				console.log("One employee updated: " + req.body.employee + ', '+ req.body.fname);
			}
		});
	});

	// Add lift
	router.post('/', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO lifts (name, capacity, highspeed, resort_id) VALUES (?,?,?,?)";
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

	//Deletes lift
	router.delete('/:id', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = "DELETE FROM lifts WHERE id = ?";
		var inserts = [req.params.id];
		sql = mysql.pool.query(sql, inserts, function(err, results, fields){
			if(err){
				res.write(JSON.stringify(err));
				res.status(400);
				res.end();
			}
			else{
				res.status(202).end();
			}
		});
	});
	return router;
}();