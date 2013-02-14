var config = require('../config');

config.jenkins = {};
config.jenkins.host = "jenkins.zanox.com";
config.jenkins.port = 80;
config.jenkins.ssl = true;
config.jenkins.name = "test";

module.exports = config;