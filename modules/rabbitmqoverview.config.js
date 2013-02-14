var config = require('../config');

config.rabbitmqoverview = {};
config.rabbitmqoverview.port = 55672;
config.rabbitmqoverview.user = 'guest';
config.rabbitmqoverview.pass = 'guest';
config.rabbitmqoverview.path = '/api/overview/'
config.rabbitmqoverview.serverList = ['rabbitmqserver1', 'rabbitmqserver1'];

module.exports = config;