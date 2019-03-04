module.exports = function(){
	var express = require('express');
	var router = express.Router();

	// Gets all Roles
	function getRoles(res, mysql, context, complete){
		var sql = "Select title FROM roles";
		mysql.pool.query(sql, function(err, results, fields){
			if(err){
				res.write(JSON.stringify(err));
				res.end();
			}
			context.roles = results;
			complete();
		});
	}

	// Root, which calls getRoles
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		var mysql = req.app.get('mysql');
		getRoles(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 1){
				res.render('roles', context);
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

	return router;
}();