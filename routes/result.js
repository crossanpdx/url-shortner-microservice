var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });

router.route('/')
.post(parseUrlencoded, function(request, response){  
    var url = request.body.url;
    response.redirect('/new/' + url);
});

module.exports = router;