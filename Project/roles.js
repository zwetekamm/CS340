module.exports = function(){
	var express = require('express');
	var router = express.Router();

	// Gets all Roles
	function getRoles(res, mysql, context, complete){
		var sql = "Select id, title FROM roles";
		mysql.pool.query(sql, function(err, results, fields){
			if(err){
				res.write(JSON.stringify(err));
				res.end();
			}
			context.roles = results;
			complete();
		});
	}

	// Gets one role for the purpose of updating
	function getRole(res, mysql, context, id, complete){
		var sql = "SELECT id, title FROM roles WHERE id=?";
		var inserts = [id];
		mysql.pool.query(sql, inserts, function(err, results, fields){
			if(err){
				res.write(JSON.stringify(err));
				res.end();
			}
			context.roles = results[0];
			complete();
		});
	}

	// Root, which calls getRoles
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		var mysql = req.app.get('mysql');
		context.jsscripts = ["editRoles.js"];
		getRoles(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 1){
				res.render('roles', context);
			}
		}
	});

	//Renders the update roles page with data pre-populated
	router.get('/:id', function(req, res){
		callbackCount = 0;
		var context = {};
		var mysql = req.app.get('mysql');
		context.jsscripts = ["editRoles.js"];
		getRole(res, mysql, context, req.params.id, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 1){
				res.render('update-role', context);
			}
		}
	});

	// Add Role
	router.post('/', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO roles (title) VALUES (?)";
		var inserts = [req.body.title];
		sql = mysql.pool.query(sql, inserts, function(err, results, fields){
			if(err){
				console.log(JSON.stringify(err));
				res.write(JSON.stringify(err));
				res.end();
			}else{
				res.redirect('/roles');
			}
		});
	});

	// Update Role and returns to /roles
	router.post('/:id', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = "UPDATE roles SET title=? WHERE id=?";
		var inserts = [req.body.title, req.params.id];
		sql = mysql.pool.query(sql, inserts, function(err, results, fields){
			if(err){
				console.log(JSON.stringify(err));
				res.write(JSON.stringify(err));
				res.end();
			}else{
				res.redirect('/roles');
				res.status(200);
				res.end();
				console.log("Role updated: " + req.body.role + ', ' + req.body.title);
			}
		});
	});

	// Delete Role
	router.delete('/:id', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = "DELETE FROM roles WHERE id = ?";
		var inserts = [req.params.id];
		sql = mysql.pool.query(sql, inserts, function(err, results, fields){
			if(err){
				console.log(JSON.stringify(err));
				res.write(JSON.stringify(err));
				res.status(400);
				res.end();
			}else{
				res.status(202).end();
			}
		});
	});

	return router;
}();