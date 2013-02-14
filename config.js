var config = {};

config.app = {};
config.app.port = 8080;
config.app.reloadTime = 30000;

config.persistence = {};
config.persistence.dbtype = "local"; // redis // mongodb
config.persistence.host = "localhost";
config.persistence.port = 27017;
config.persistence.dbname = "capCon";
config.persistence.collection = "dashboards";

module.exports = config;