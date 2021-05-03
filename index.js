const { startServer } = require('./server/socket.js');
const { DatabaseManager } = require('./server/DatabaseManager.js');
const ExampleHandler = require('./server/ExampleHandler.js');

startServer();
DatabaseManager.connect();
ExampleHandler.startListen();
