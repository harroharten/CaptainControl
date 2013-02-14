var config = {};

config.app = {};
config.app.port = 8080;

config.jenkins = {};
config.jenkins.host = "jenkins.yourcompany.com";
config.jenkins.port = 80;
config.jenkins.ssl = true;
config.jenkins.name = "test";

config.persistence = {};
config.persistence.dbtype = "local"; // redis // mongodb
config.persistence.host = "localhost";
config.persistence.port = 27017;
config.persistence.dbname = "capCon";
config.persistence.collection = "dashboards";

config.rabbitmq = {};
config.rabbitmq.host = "";
config.rabbitmq.port = 55672;
config.rabbitmq.user = 'guest';
config.rabbitmq.pass = 'guest';
config.rabbitmq.vhost = '%2F';


module.exports = config;