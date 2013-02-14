var config = require('../config')
	, http = require('http')
	, logger = GLOBAL.logger || console;

	
var getOptions = function(callback) {
	var username = config.rabbitmq.user;
	var password = config.rabbitmq.pass;
	var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
	var options = {
		host: config.rabbitmq.host,
		port: config.rabbitmq.port,
		path:'/api/queues',
		headers: {
			"Authorization": auth
		}
		
	};
	var req = http.get(options, function(res) {
		var data = '';

		// handle error if res.statusCode > 400
		res.on('data', function(chunk) {
			data += chunk;
		});
		res.on('end', function() {
			var error;
			if (res.statusCode > 400) {			
				error = "error status: " + res.statusCode + " while getting RabbitMQ queue list  for '" + config.rabbitmq.host + " " + config.rabbitmq.port + "'";
				logger.error(error);
			} else {
				var jsonData = JSON.parse(data);
				var queues = [];
				
				for (var i = 0; i < jsonData.length; i++) {
					queues.push( jsonData[i].name); 
				}
				var result = {server : config.rabbitmq.host + " " + config.rabbitmq.port,
							  queues : queues};
				callback(error, result);
			}
		});
	});
}

var getValues = function(option, callback) {
	var username = config.rabbitmq.user;
	var password = config.rabbitmq.pass;
	var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
	var options = {
		host: config.rabbitmq.host,
		port: config.rabbitmq.port,
		path: '/api/queues/' + config.rabbitmq.vhost + '/' + option.queue,
		headers: {
			"Authorization": auth
		}
	};

	var req = http.get(options, function(res) {
		var data = '';

		
		res.on('data', function(chunk) {
			data += chunk;
		});
		res.on('end', function() {
			var error;
			// error handling
		    if (res.statusCode > 400) {			
				error = "error status: " + res.statusCode + " while getting jenkins result for '" + option.queue + "'";
				logger.error(error);
			} else {
				var jsonData = JSON.parse(data);
				
				var result = {"result": {name : option.queue, data : data }};
				callback(error, result);
			}
		});
				
	});
}


// Initializing (adding the module)
if (typeof GLOBAL.moduleList === 'undefined') {
	GLOBAL.moduleList = {};
}
GLOBAL.moduleList.rabbitmqueues = this;

module.exports.title = "RabbitMQ Queues Monitoring";
module.exports.getValues = getValues;
module.exports.getOptions = getOptions;