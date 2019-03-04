module.exports = function(){
	var express = require('express');
	var router = express.Router();

	// Gets all Schedule
	function getSchedule(res, mysql, context, complete){
		var sql = "SELECT schedule.date, schedule.id, employees.fname, employees.lname, roles.title, lifts.name FROM (((schedule LEFT JOIN employees ON schedule.employee_id = employees.id) LEFT JOIN roles ON schedule.role_id = roles.id) LEFT JOIN lifts ON schedule.lift_id = lifts.id) ORDER BY schedule.date DESC";
		mysql.pool.query(sql, function(err, results, fields){
			if(err){
				res.write(JSON.stringify(err));
				res.end();
			}
			context.schedule = results;
			complete();
		});
	}

	// Gets all employees for select dropdown
	function getEmployees(res, mysql, context, complete){
		var sql = "SELECT id AS employee_id, fname, lname FROM employees ORDER BY employees.fname";
		mysql.pool.query(sql, function(err, results, fields){
			if(err){
				res.write(JSON.stringify(err));
				res.end();
			}
			context.employees = results;
			complete();
		});
	}

	// Gets all roles for select dropdown
	function getRoles(res, mysql, context, complete){
		var sql = "SELECT id AS role_id, title FROM roles ORDER BY title";
		mysql.pool.query(sql, function(err, results, fields){
			if(err){
				res.write(JSON.stringify(err));
				res.end();
			}
			context.roles = results;
			complete();
		});
	}

	// Gets all lifts for select dropdown
	function getLifts(res, mysql, context, complete){
		var sql = "SELECT id as lift_id, name FROM lifts ORDER BY lifts.name";
		mysql.pool.query(sql, function(err, results, fields){
			if(err){
				res.write(JSON.stringify(err));
				res.end();
			}
			context.lifts = results;
			complete();
		});
	}

	// Get ordered schedule ids for select dropdown
	function getOrderedIds(res, mysql, context, complete){
		var sql = "SELECT id FROM schedule ORDER BY id ASC";
		mysql.pool.query(sql, function(err, results, fields){
			if(err){
				res.write(JSON.stringify(err));
				res.end();
			}
			context.orderedIds = results;
			complete();
		});
	}

	// Root, which calls getSchedule
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		var mysql = req.app.get('mysql');
		getSchedule(res, mysql, context, complete);
		getEmployees(res, mysql, context, complete);
		getRoles(res, mysql, context, complete);
		getLifts(res, mysql, context, complete);
		getOrderedIds(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 5){
				res.render('schedule', context);
			}
		}
	});

	// Add Schedule
	router.post('/', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO schedule (employee_id, role_id, lift_id, date) VALUES (?,?,?,?);";
		var inserts = [req.body.employee_id, req.body.role_id, req.body.lift_id, req.body.date];
		sql = mysql.pool.query(sql, inserts, function(err, results, fields){
			if(err){
				console.log(JSON.stringify(err));
				res.write(JSON.stringify(err));
				res.end();
			}else{
				res.redirect('/schedule');
			}
		});
	});

	return router;
}();