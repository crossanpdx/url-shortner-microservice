var express = require('express');
var app = express();

require('dotenv').config();
app.set('port', (process.env.PORT || 8080));

app.use(express.static('public'));

var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

// connect to the MongoDB database
MongoClient.connect(process.env.MONGO_LAB_URL, function(err, db) {

    assert.equal(null, err);
    console.log("Successfully connected to MongoDB.");

    // homepage
    app.get('/', function(req, res) {
        res.sendFile(__dirname + '/public/html/index.html');
    });
    
    // require route modules
    var newUrlForm = require('./routes/newform');
    var newUrl = require('./routes/new');
    var forwardUrl = require('./routes/forwarder');
    
    // all requests are dispatched to the routers
    app.use('/new_form', newUrlForm);
    newUrl(app, db);
    forwardUrl(app, db);
    
    
    // listen for client connections
    app.listen(app.get('port'), function() {
        console.log('Express server listening on port', app.get('port'));
    });

});
    
