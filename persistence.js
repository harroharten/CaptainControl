var config = require('./config')
	, logger = GLOBAL.logger || console;


var db;
var persistenceType = config.persistence.dbtype;
var localDB = new Array();
var REDIS_KEY_PREFIX = "xrayboard.";
switch (persistenceType) {
	case "redis":
		var redis = require('redis');
		db = redis.createClient( config.persistence.port, config.persistence.host );
	break;
	case "mongodb":
		var mongodb = require('mongodb');
		var server = new mongodb.Server(config.persistence.host, config.persistence.port, {auto_reconnect: true});
		db = new mongodb.Db(config.persistence.dbname, server, {safe:true});
		db.open(function(err, db) {
			if(!err) {
				logger.info("Connection to MongoDB successful (" + config.persistence.host + ":" + config.persistence.port + "/" + config.persistence.dbname + ")");
			} else {
				logger.error("Connection to MongoDB failed (" + config.persistence.host + ":" + config.persistence.port + "/" + config.persistence.dbname + ")");
			}
		});
	break;
	default:
		var dashboard = {title:"TestLocal"};
		localDB.push(dashboard);
		logger.info("No persistence type set, dahsboards will be locally saved (and restart will delete everything !)");
	break;
}



var saveDashboard = function(dashboard, callback) {
	switch (persistenceType) {
		case "redis":
			db.set(REDIS_KEY_PREFIX + dashboard.title, JSON.stringify(dashboard));
			callback(undefined, result);
		break;
		case "mongodb":
			db.collection(config.persistence.collection, function(err, collection) {
				collection.insert(dashboard, {safe:true}, function(err, result) {
					callback(err, result);
				});
			});
		break;
		default:
			localDB.push(dashboard);
			callback(undefined, dashboard);
		break;
	}
};


var updateDashboard = function(dashboard, callback) {
	switch (persistenceType) {
		case "redis":
			db.set(REDIS_KEY_PREFIX + dashboard.title, JSON.stringify(dashboard));
			logger.info("Dashboard \"" + dashboard.title + "\" should be saved.");
		break;
		case "mongodb":
			db.collection(config.persistence.collection, function(err, collection) {
				collection.update({"title" : dashboard.title}, dashboard, {safe:true}, function(err, result) {
					logger.info("Dashboard \"" + dashboard.title + "\" saved.");
					callback(err, result);
				});
			});
		break;
		default:
			for (var i = 0; i < localDB.length; i++) {
		        if (localDB[i].title === dashboard.title) {
		        	localDB.splice(i, 1, dashboard);
		        }
		    }
		break;
	}
};

var loadAllDashboards = function(callback) {
	switch (persistenceType) {
		case "redis":
			db.keys(REDIS_KEY_PREFIX + "*", function(err, keyset) {
				if (err) {
					logger.error(err);
				} else {
					db.mget(keyset, function(error, results) {
					    callback(error, results);
					});
				}
			});
		break;
		case "mongodb":
			db.collection(config.persistence.collection, function(err, collection) {
				collection.find().toArray(function(err, results) {
					if (!err) {
						logger.info("All dashboards successfully loaded.");
					}
					callback(err, results);
				});
			});
		break;
		default:
			callback(undefined, localDB);
		break;
	}
};

var loadDashboard = function(dashboardTitle, callback) {
	switch (persistenceType) {
		case "redis":
			db.get(REDIS_KEY_PREFIX + dashboardTitle, function(error, result) {
				callback(error, result);		
			});
		break;
		case "mongodb":
				db.collection(config.persistence.collection, function(err, collection) {
					collection.findOne({"title" : dashboardTitle}, function(err, item) {
						callback(err, item);
					});
				});
		break;
		default:
			for (var i = 0; i < localDB.length; i++) {
		        if (localDB[i].title === dashboardTitle) {
		        	callback(undefined, localDB[i]);
		        }
		    }
		break;
	}
};



var deleteDashboard = function(dashboardTitle, callback) {

	switch (persistenceType) {
		case "redis":
			db.del(REDIS_KEY_PREFIX + dashboardTitle, function(error) {
				callback(error);
			});	
		break;
		case "mongodb":
				logger.info("Deleting dashboard: " + dashboardTitle);
				db.collection(config.persistence.collection, function(err, collection) {
					collection.remove({ "title" : dashboardTitle }, function(err, removed) {
						callback(err);
					});
				});
		break;
		default:
			for (var i = 0; i < localDB.length; i++) {
		        if (localDB[i].title === dashboard.title) {
		        	localDB.splice(i, 1);
		        }
		    }
		break;
	}
};

module.exports.saveDashboard = saveDashboard;
module.exports.deleteDashboard = deleteDashboard;
module.exports.loadDashboard = loadDashboard;
module.exports.loadAllDashboards = loadAllDashboards;
module.exports.updateDashboard = updateDashboard;




