var config = rootRequire('./config'); // get our config file
var Client = require('node-rest-client').Client;
var client = new Client();

module.exports = {
	create: function create(req, res, next) {
		var _body = req.body;

		var args = {
		    data: _body,
		    headers: { "Content-Type": "application/json",
		    			"X-API-Key": config.osticketapikey }
		},
		url = config.osticketserver + '/api/tickets.json';

		client.post(url, args, function (data, response) {
		    // parsed response body as js object 
		    console.log(data);
		    
		    return res.status(200)
	            .json({
	                status: 'success',
	                data: data,
	                message: 'Created new ticket successfully'
	            });
		});
	},
}