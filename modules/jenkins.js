var config = require('./jenkins.config')
	, http = require('http')
	, logger = GLOBAL.logger || console;

if (config.jenkins.ssl) {
	http = require('https');
}


var getOptions = function(callback) {
	logger.info("entering getOptions for Jenkins !");
	var options = {
		host: config.jenkins.host,
		path:'/api/json'
	};
	var req = http.get(options, function(res) {
		logger.info("Call made !");
		var data = '';

		res.on('data', function(chunk) {
			data += chunk;
		});
		res.on('end', function() {
			logger.info("Result received: ", data);
			
			if (res.statusCode > 400) {		
				var error = "error status: " + res.statusCode + " while getting jenkins job list  for '" + config.jenkins.host + " " + config.jenkins.port + "'";
				logger.error(error);
			} else {
				var jsonData = JSON.parse(data);
				var names = [];
				
				for (var i = 0; i < jsonData.jobs.length; i++) {
					names.push( jsonData.jobs[i].name); 
				}
				var result = {"server" : config.jenkins.host + " " + config.jenkins.port,
							  "jobs" : names};
			}
			callback(error, result);
		});
	});
}
	
var getValues = function(jobContainer, callback) {
	
	var job = encodeURIComponent(jobContainer.job);

	var options = {
		host: config.jenkins.host,
		path: '/job/' + job + '/api/json'
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
				error = "error status: " + res.statusCode + " while getting jenkins result for '" + jobContainer.job + "'";
				logger.error(error);
			} else {
				var jsonData = JSON.parse(data);
				var status = convertStatus(jsonData.color.toString());
				var lastbuild = jsonData.lastBuild.number.toString();
				
				var result = {result: {name : jobContainer.job, 
										 status : status, 
										 lastbuild : lastbuild}};
			}
			callback(error, result);
		});
				
	});
}

function convertStatus(color) {
	switch(color) {
		case "blue": return "success";
		case "red": return "failed";
		case "yellow": return "instable";
		case "disabled": return "disabled";
		
		case "blue_anime": return "building now sucess";
		case "red_anime": return "building now failed";
		case "yellow_anime": return "building now instable";
		default : return "unknown"
	}
}


// Initializing (adding the module)
if (typeof GLOBAL.moduleList === 'undefined') {
	GLOBAL.moduleList = {};
}
GLOBAL.moduleList.jenkins = this;

module.exports.title = "Jenkins Job Build Status";
module.exports.getValues = getValues;
module.exports.getOptions = getOptions;