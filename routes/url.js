
var assert = require('assert');

module.exports = function(app, db) {
    // add url via dynamic route
    app.get('/new/:url(*)', function(request, response){
        var url = request.url.slice(5);
        var httpProto = request.headers["x-forwarded-proto"];
        var myDomain = request.headers.host;
        if (url.match(/[\s]/i) || !(url.match(/[\.]/g))) {
            response.status(404).json({ error: "URL invalid"});
        }
        else { 
            if (!(url.match(/(http:\/\/)/i)) && !(url.match(/(https:\/\/)/i))) {
                url = "http://" + url;
            }
            
            // check if url is in the database
            db.collection('short').find({ "long_url": url }).toArray(function(err, docs) {
                    assert.equal(err, null);
                    // if not add the url to the database with a short url
                    if (docs.length == 0) {
                        // count the number of entries to add the next short url
                        db.collection('short').find().count(function(err, count) {
                            assert.equal(err, null);
                            var shortNum = count+1;
                            // add the new url to the database and respond
                            db.collection('short').insert({ "long_url": url, "short_url": shortNum });
                            response.json({ original_url: url, short_url: httpProto + "://" + myDomain + "/" + shortNum });
                        });
                    } 
                    // if it is in the database then respond with the result
                    else {
                        response.json({ original_url: docs[0].long_url, short_url: httpProto + "://" + myDomain + "/" + docs[0].short_url });
                    }
                    
                });
        }
    });
};
