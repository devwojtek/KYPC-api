var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = rootRequire('./config'); // get our config file

module.exports = function (req, res, next) {
	// check header or url parameters or post parameters for token
    var token = req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
};

// TEST
// var t = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNDk1NjQxNjUzfQ.1BaFDAAbkjPq9PSsvHs_vWfi0SXqfx4dxkYqjel6CVo";
// jwt.verify(t, config.secret, function(err, decoded){
// 	console.log(err, decoded)
// })