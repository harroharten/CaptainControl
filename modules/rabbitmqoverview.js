var config = require('../config')
	, http = require('http')
	, logger = GLOBAL.logger || console;

	

var getOptions = function(callback) {
	var serverList = ['s-rmq-01', 's-rmq-02'];
	callback(undefined, serverList);
}


var getValues = function(option, callback) {
	var username = config.rabbitmq.user;
	var password = config.rabbitmq.pass;
	var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
	var options = {
		host: option.server,
		port: config.rabbitmq.port,
		path: '/api/overview/',
		headers: {
			"Authorization": auth
		}
	};

	var req = http.get(options, function(res) {
		var data = '';
		var error;
		// handle error 

		
		res.on('data', function(chunk) {
			data += chunk;
		});
		res.on('end', function() {
			// error handling
		    if (res.statusCode > 400) {			
				error = "error status: " + res.statusCode + " while getting rabbitmqoverview result for '" + option.server + "'";
				logger.error(error);
			} else {
				var jsonData = JSON.parse(data);
				
				var result = {"result": {name : option.server, data : data }};
				callback(error, result);
			}
		});
				
	});
}


// Initializing (adding the module)
if (typeof GLOBAL.moduleList === 'undefined') {
	GLOBAL.moduleList = {};
}
GLOBAL.moduleList.rabbitmqoverview = this;

module.exports.title = "RabbitMQ Server overview";
module.exports.getValues = getValues;
module.exports.getOptions = getOptions;