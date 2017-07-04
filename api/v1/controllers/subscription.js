var config = rootRequire('./config'); // get our config file
var connect = rootRequire('./db/queries'); // local postgres connection
var helper = rootRequire('./api/v1/helper');

module.exports = {
	listAllSubscriptions: function listAllSubscriptions(req, res, next){
  //       console.log("get data")
		connect.db.any("SELECT * FROM subscriptions")
    .then(function(data) {
        return res.status(200)
            .json({
                status: 'success',
                data: data,
                message: 'Retrieved ALL subscriptions'
            });
    })
    .catch(function(err) {
        console.log("error data")
        return res.status(500)
            .json({
                status: 'fail',
                err: err,
                message: 'Something went wrong !'
            });
    });
	},

	getById: function getById(req, res, next){
		_params = req.params;
        var id = _params.id ? _params.id : null;
        connect.db.any('SELECT * FROM subscriptions WHERE _id = $1', id)
            .then(function(sub) {
                if (sub.length > 0) {
                    sub = sub[0];
                } else {
                    sub = null
                }

                if (sub && sub != null) {
                    return res.status(200)
                        .json({
                            status: 'success',
                            data: sub,
                            message: 'sub fetched Successfully.'
                        });

                } else {
                    return res.status(401)
                        .json({
                            status: 'fail',
                            err: "Unauthorized access.",
                            message: 'User not found.'
                        });
                }
            })
            .catch(function(err) {
                return res.status(500)
                    .json({
                        status: 'fail',
                        err: err,
                        message: 'Something went wrong !'
                    });
            });
        res.send("hi")
	},

	updateById: function updateById(req, res, next){
		var _body = req.body;
        var _params = req.params;
        // validations
        if (!_params.id) {
            return res.send({ status: 0, message: 'Invalid parameters' });
        }
        connect.db.any('SELECT * FROM subscriptions WHERE id = $1', _params.id)
            .then(function(sub) {
                if (sub.length > 0) {
                    sub = sub[0];
                } else {
                    sub = null
                }
                if (sub && sub != null) {
                    _body.eventtitle = _body.eventtitle ? _body.eventtitle : sub.eventtitle;
                    _body.alertendpoint = _body.alertendpoint ? _body.alertendpoint : sub.alertendpoint;

                    connect.db.one('update subscriptions set eventtitle=$1, alertendpoint=$2 where id = $3 RETURNING * ', [_body.eventtitle, _body.alertendpoint, _params.id])
                        .then(function(data) {
                            res.status(200)
                                .json({
                                    status: 'success',
                                    data: data,
                                    message: 'Updated sub successfully.'
                                });
                        })
                        .catch(function(err) {
                            return res.status(500)
                                .json({
                                    status: 'fail',
                                    err: err,
                                    message: 'Something went wrong !'
                                });
                        });
                } else {
                    return res.status(401)
                        .json({
                            status: 'fail',
                            err: "Unauthorized access.",
                            message: 'Incorrect sub.'
                        });
                }
            })
            .catch(function(err) {
                // console.log(err);
                return res.status(500)
                    .json({
                        status: 'fail',
                        err: err,
                        message: 'Something went wrong !'
                    });
            });
	},


	/**
     * Delete API
     */
    deleteById: function deleteById(req, res, next) {
        var _params = req.params;

        // validations
        if (!_params.id) {
            return res.send({ status: 0, message: 'Invalid parameters' });
        }
        // delete;
        connect.db.result('DELETE FROM subscriptions WHERE id = $1', _params.id)
            .then(function(result) {
                // rowCount = number of rows affected by the query
                if (result.rowCount > 0) {
                    return res.status(200)
                        .json({
                            status: 'success',
                            data: result,
                            message: 'sub deleted Successfully.'
                        });
                } else {
                    return res.status(401)
                        .json({
                            status: 'fail',
                            err: "Unauthorized access.",
                            message: 'sub not found.'
                        });
                }
                // console.log(result.rowCount); // print how many records were deleted;
            })
            .catch(function(err) {
                // console.log('ERROR:', error);
                return res.status(500)
                    .json({
                        status: 'fail',
                        err: err,
                        message: 'Something went wrong !'
                    });
            });
    },

    create: function create(req, res, next) {

        var _body = req.body;

        // validations
        if (!_body.clientname) {
            return res.send({ status: 0, message: 'Invalid parameters' });
        }

        connect.db.one('INSERT INTO subscriptions (eventtitle, alertendpoint ) VALUES($1, $2) RETURNING *', [_body.eventtitle, _body.alertendpoint])
        .then(function(data) {
            return res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Successfully created'
                });
        })
        .catch(function(err) {
            console.log(err);
            return res.status(500)
                .json({
                    status: 'fail',
                    err: err,
                    message: 'Something went wrong !'
                });
        });
    },
}