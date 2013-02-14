#!/usr/bin/env node

var http = require('http')
	, fs = require('fs')
	, util = require('util')
	, static = require('node-static')
	, config = require('./config')
	, os = require( 'os' )
	, socketio = require('socket.io')
	, events = require('events')
	, url = require('url')
	, winston = require('winston')
	, db = require('./persistence');

/**
*
* Set up the application.
*
*/
// Adding a custom transport to log to the client console
var ClientConsoleLogger = winston.transports.ClientConsoleLogger = function (options) {
	options = options || {};

	this.name = 'clientConsoleLogger';
	this.level = options.level || 'info';
};
util.inherits(ClientConsoleLogger, winston.Transport);
ClientConsoleLogger.prototype.log = function (level, msg, meta, callback) {
	serverEventPool.emit('clientConsoleLogger', msg);
	callback(null, true);
};

// Setting up logging.
var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)(),
		new (winston.transports.File)({ filename: 'logs/information.log' }),
		new (winston.transports.ClientConsoleLogger)()
	],
	exceptionHandlers: [
		new (winston.transports.File)({ filename: 'logs/exceptions.log' })
	],
	exitOnError: false
});
// Making the logger global to access it from the modules
GLOBAL.logger = logger;
// TODO: extract it, import it where needed and remove global ?


// Setting up a local eventPool
var serverEventPool = new events.EventEmitter();
serverEventPool.setMaxListeners(0);
// Making the eventPool global to access it from the modules
// GLOBAL.serverEventPool = serverEventPool; Not yet, needed for push functionnalities, which are not there yet


// Loading all the modules (synchronously of course)
var moduleFileList = fs.readdirSync(__dirname + '/modules/');

var moduleList = [];
var count = 0;
for (var id in moduleFileList) {
	var moduleName = moduleFileList[id];
	var splittedModuleName = moduleName.split('.');
	if (splittedModuleName[1] === 'js' && splittedModuleName.length < 3) {
		var moduleInstance = require(__dirname + '/modules/' + moduleName);
		moduleList[count] = { name: splittedModuleName[0], title: moduleInstance.title, instance: moduleInstance };
		count++;
	}
}


// Setting up a static server
var file = new(static.Server)('./public');

// Creating and launching the HTTP server on port $port.
var server = http.createServer(function(req, res){
	
	var parsedUrl = url.parse(req.url, true);
	var path = parsedUrl.pathname;
	if (path.indexOf('push') >= 0) {
		var query = parsedUrl.query;
		serverEventPool.emit(query.moduleName + 'Event', 'testPushEvent');
		res.writeHead(200, {"Content-Type": "text/plain"});
		res.write("Push it real good !");
		res.end();
	} else {
		file.serve(req, res);
	}
}).listen(config.app.port, function() {
     logger.info("HTTP server successfuly started at http://" + os.hostname() + ":"+ server.address().port);
});


// Setting up the socket IO server.
var io = socketio.listen(server);
io.set('log level', 1);


// Listening on Connection
io.sockets.on('connection', function(socket) {
	socket.emit('initModuleList', moduleList);
	serverEventPool.on('clientConsoleLogger', function(data) {
		socket.emit('sendToConsole', ( new Date() ).toISOString() + ' ' + data);
	});

	db.loadAllDashboards(function(error, results) {
		socket.emit("initDashboardList", results);
	});

	// Client requested all the dashboards
	socket.on('loadDashboardWindow', function() {
		getAndEmitAllDashboards();
	});

	// Client requested to delete a dashboard
	socket.on('deleteDashboard', function(dashboardTitle) {
		logger.info("DeleteDashboard in progress...");
		db.deleteDashboard(dashboardTitle, function(error) {
			if (error) {
				logger.error(error);
			} 
			socket.emit("dashboardDeleted", dashboardTitle);
		});
	});
		
	// Client requested to Load a dashboard
	socket.on('loadDashboard', function(dashboardTitle) {
		db.loadDashboard(dashboardTitle, function(error, value) {
			if (error) {
				logger.error(error);
			} else {
				logger.info("Dashboard \"" + dashboardTitle + "\" loaded!");
				socket.emit('buildDashboard', value);
			}
		});
	});

	// Client requested to save a dashboard
	socket.on('saveDashboard', function(dashboard) {
		db.saveDashboard(dashboard, function(err, result) {
			if (!err) {
				logger.info("Dashboard \"" + dashboard.title + "\" correctly saved.");
			} else {
				logger.info("There were a problem while saving dashboard \"" + dashboard.title + "\".");
			}
		});
	});

	//Client requested to add a widget : saving it, registering the eventHandler and getting the values
	socket.on('addWidget', function(data) {
		logger.info("Adding a widget: " + data.widget.moduleName);
		var newWidget = data.widget;
		var dashboard = data.dashboard;

		db.updateDashboard(dashboard);

		if (newWidget.options.type === 'push') {
			serverEventPool.on(newWidget.moduleName + 'Event', function(data) {
				socket.emit('pushValues', data);
			});
		} else {
		
		    getValues(newWidget, function(error, result) {
				logger.info("Getting values: ", result);
		    	if (!error) {
			    	result.time = new Date();
			    	socket.emit('widgetValues', result, newWidget);
			    }
		    });

			
			serverEventPool.on(newWidget.moduleName + 'Event', function() {
				console.log(newWidget.moduleName + 'Event');
				getValues(newWidget, function(error, result) {
					if (!error) {
						result.time = new Date();
			    		socket.emit('widgetValues', result, newWidget);
			    	}
		    	});
			});
		 }
	});

	// Client requested the options for the widget
	socket.on('getOptions', function(widget) {
		getOptions(widget, function(error, result) {
			widget.options = result;
			socket.emit('setOptions', widget);
		});
	});
});


var getValues = function(widget, callback) {
	try {
		GLOBAL.moduleList[widget.moduleName].getValues(widget.options, function(error, result) {
			// TODO : handle errors
			callback(error, result);
		});
	} catch (e) {
		logger.error(e);
	}
};

var getOptions = function(widget, callback) {
	try {
		GLOBAL.moduleList[widget.moduleName].getOptions(function(error, result) {
			// TODO : handle errors
			callback(error, result);
		});
	} catch (e) {
		logger.error(e);
	}
};

var launchAllEvent = function() {
	for (var module in GLOBAL.moduleList) {
		serverEventPool.emit(module + 'Event');
	}
};
setInterval(launchAllEvent, config.app.reloadTime);