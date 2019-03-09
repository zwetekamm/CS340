module.exports = function(){
	var express = require('express');
	var router = express.Router();

	// Gets all Resorts
	function getResorts(res, mysql, context, complete){
		var sql = "Select id, name, location, size, price FROM resorts ORDER BY name";
		mysql.pool.query(sql, function(err, results, fields){
			if(err){
				res.write(JSON.stringify(err));
				res.end();
			}
			context.resorts = results;
			complete();
		});
	}

	// Gets one resort for the purpose of updating
	function getResort(res, mysql, context, id, complete){
		var sql = "SELECT id, name, location, size, price FROM resorts WHERE id=?";
		var inserts = [id];
		mysql.pool.query(sql, inserts, function(err, results, fields){
			if(err){
				res.write(JSON.stringify(err));
				res.end();
			}
			context.resorts = results[0];
			complete();
		})
	}

	// Root, which calls getResorts
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		var mysql = req.app.get('mysql');
		context.jsscripts = ["editResorts.js"];
		getResorts(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 1){
				res.render('resorts', context);
			}
		}
	});

	//Renders the update resort page with data pre-populated
	router.get('/:id', function(req, res){
		callbackCount = 0;
		var context = {};
		var mysql = req.app.get('mysql');
		context.jsscripts = ["editResorts.js"];
		getResort(res, mysql, context, req.params.id, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 1){
				res.render('update-resort', context);
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

	// Update Resort and returns to /resorts
	router.post('/:id', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = "UPDATE resorts SET name=?, location=?, size=?, price=? WHERE id=?";
		var inserts = [req.body.name, req.body.location, req.body.size, req.body.price, req.params.id];
		sql = mysql.pool.query(sql, inserts, function(err, results, fields){
			if(err){
				console.log(JSON.stringify(err));
				res.write(JSON.stringify(err));
				res.end();
			}else{
				res.redirect('/resorts');
				res.status(200);
				res.end();
				console.log("Resort updated: " + req.body.resort + ', ' + req.body.name);
			}
		});
	});

	// Delete Resort
	router.delete('/:id', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = "DELETE FROM resorts WHERE id = ?";
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