var sys   = require('util')
    , spawn = require('child_process').spawn
    , logger = GLOBAL.logger || console;



var getValues = function(host, callback) {
    logger.info("Accessing ping.getValues() with option: " + host);
    probe(host, function(data) {
        var result = { host: host , alive: data };
        logger.info("Result of ping.getValues: " + data + " (Requested: " + host + ")");
        callback(undefined, result);
    });
}


var getOptions = function(callback) {
    // Since this module doesn't have options, we just send an empty object.
	  callback("");
}

// ----------------------------------------- ping ----------------------------------------- 


function probe(addr, callback) {

    if (process.platform === 'win32') {
    	var ls = spawn('C:/windows/system32/ping.exe', ['-n', '1', '-w', '5000', addr]);
    } else {
    	var ls = spawn('/bin/ping', ['-n', '-w 2', '-c 1', addr]);
    }

    ls.on('exit', function (code) {
        var result = (code === 0 ? true : false);
        callback(result);
    }); 
}



// Initializing (adding the module)
if (typeof GLOBAL.moduleList === 'undefined') {
	GLOBAL.moduleList = {};
}
GLOBAL.moduleList.ping = this;

// We export the needed properties (getValue and getOptions if available)

module.exports.title = "Ping a host or IP";
module.exports.getValues = getValues;
module.exports.getOptions = getOptions;