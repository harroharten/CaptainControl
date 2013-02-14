var config = require('../config');

config.rabbitmqoverview = {};
config.rabbitmqoverview.port = 55672;
config.rabbitmqoverview.user = 'guest';
config.rabbitmqoverview.pass = 'guest';
config.rabbitmqoverview.path = '/api/overview/'
config.rabbitmqoverview.serverList = ['s-rmq-01', 's-rmq-02'];

module.exports = config;