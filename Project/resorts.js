module.exports = function(){
	var express = require('express');
	var router = express.Router();

	// Gets all Resorts
	function getResorts(res, mysql, context, complete){
		var sql = "Select name, location, size, price FROM resorts ORDER BY name";
		mysql.pool.query(sql, function(err, results, fields){
			if(err){
				res.write(JSON.stringify(err));
				res.end();
			}
			context.resorts = results;
			complete();
		});
	}

	// Root, which calls getResorts
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		var mysql = req.app.get('mysql');
		getResorts(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 1){
				res.render('resorts', context);
			}
		}
	});

	// Add Resort
	router.post('/', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO resorts (name, location, size, price) VALUES (?,?,?,?)";
		var inserts = [req.body.name, req.body.location, req.body.size, req.body.price];
		sql = mysql.pool.query(sql, inserts, function(err, results, fields){
			if(err){
				console.log(JSON.stringify(err));
				res.write(JSON.stringify(err));
				res.end();
			}else{
				res.redirect('/resorts');
			}
		});
	});

	return router;
}();