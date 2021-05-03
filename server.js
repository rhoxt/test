var dotenv = require('dotenv');
var path = require('path');
var connect = require('connect');
var serveStatic = require('serve-static');

dotenv.config()
console.log(process.env.DB_URL);

connect()
    .use(serveStatic(path.join(__dirname, "public")))
    .listen(8080, function(){
        console.log('Server running on http://localhost:8080');
    });