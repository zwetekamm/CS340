module.exports = function(){
	var express = require('express');
	var router = express.Router();

	// Gets all Employees
	function getEmployees(res, mysql, context, complete){
		var sql = "SELECT employees.id, employees.fname, employees.lname, employees.birthday, employees.resort_id, employees.lift_id, resorts.name AS rname, lifts.name AS liname FROM employees INNER JOIN resorts ON employees.resort_id = resorts.id INNER JOIN lifts ON employees.lift_id = lifts.id ORDER BY employees.fname";
		mysql.pool.query(sql, function(err, results, fields){
			if(err){
				res.write(JSON.stringify(err));
				res.end();
			}
			context.employees = results;
			complete();
		});
	}
	// Gets one person for the purpose of updating
	function getEmployee(res, mysql, context, id, complete){
		var sql = "SELECT id, fname, lname, resort_id, lift_id FROM employees WHERE id=?";
		var inserts = [id];
		mysql.pool.query(sql, inserts, function(err, results, fields){
			if(err){
				res.write(JSON.stringify(err));
				res.end();
			}
			context.employees = results[0];
			complete();
		})
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
		var sql = "SELECT id, name FROM lifts ORDER BY name";
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
		context.jsscripts = ["editEmployees.js", "selectResort.js", "selectLift.js"];
		getEmployees(res, mysql, context, complete);
		getResorts(res, mysql, context, complete);
		getLifts(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 3){
				res.render('employees', context);
			}
		}
	});

	//Renders the update employee page with data pre-populated
	router.get('/:id', function(req, res){
		callbackCount = 0;
		var context = {};
		context.jsscripts = ["editEmployees.js", "selectResort.js", "selectLift.js"];
		var mysql = req.app.get('mysql');
		getEmployee(res, mysql, context, req.params.id, complete);
		getResorts(res, mysql, context, complete);
		getLifts(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 3){
				res.render('update-employee', context);
			}
		}

	});

	// Add Employee
	router.post('/', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO employees (fname, lname, birthday, resort_id, lift_id)VALUES (?,?,?,?,?)";
		var inserts = [req.body.fname, req.body.lname, req.body.birthday, req.body.resort, req.body.lift];
		sql = mysql.pool.query(sql, inserts, function(err, results, fields){
			if(err){
				console.log(JSON.stringify(err));
				res.write(JSON.stringify(err));
				res.end();
			}else{
				res.redirect('/employees');
			}
		});
	});

	// Updates the employee and returns to /employees
	router.post('/:id', function(req, res){
		var mysql = req.app.get('mysql');
		console.log(req.body);
		console.log(req.params.id);
		var sql = "UPDATE employees SET fname=?, lname=?, birthday=?, resort_id=?, lift_id=? WHERE employees.id=?";
		var inserts = [req.body.fname, req.body.lname, req.body.birthday, req.body.resort, req.body.lift, req.params.id];
		sql = mysql.pool.query(sql, inserts, function(err, results, fields){
			if(err){
				console.log(err);
				res.write(JSON.stringify(err));
				res.end();
			} else{
				res.redirect('/employees');
				res.status(200);
				res.end();
				console.log("One employee updated: " + req.body.employee + ', '+ req.body.fname);
			}
		});
	});

	//Deletes employee
	router.delete('/:id', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = "DELETE FROM employees WHERE id = ?";
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