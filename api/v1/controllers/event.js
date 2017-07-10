var config = rootRequire('./config'); // get our config file
var connect = rootRequire('./db/queries'); // local postgres connection
var helper = rootRequire('./api/v1/helper');

module.exports = {
    listAllEvents: function listAllEvents(req, res, next){
    console.log("get data")
    connect.db.any("SELECT * FROM alerts ORDER BY created_at ASC")
    .then(function(data) {
        return res.status(200)
            .json({
                status: 'success',
                data: data,
                message: 'Retrieved ALL Events'
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
        var _params = req.params
            ,id = _params.id ? _params.id : null;

        connect.db.any('SELECT * FROM alerts WHERE _id = $1', id)
            .then(function(event) {
                if (event.length > 0) {
                    alerts = event[0];
                } else {
                    alerts = null
                }

                if (event && alerts != null) {
                    return res.status(200)
                        .json({
                            status: 'success',
                            data: event,
                            message: 'Event fetched Successfully.'
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
        var _body = req.body
            ,_params = req.params;
        // validations
        if (!_params.id) {
            return res.send({ status: 0, message: 'Invalid parameters' });
        }
        connect.db.any('SELECT * FROM alerts WHERE id = $1', _params.id)
            .then(function(event) {
                if (event.length > 0) {
                    alerts = event[0];
                } else {
                    alerts = null
                }
                if (event && alerts != null) {
                    _body.title = _body.title ? _body.title : event.title;

                    connect.db.one('update alerts set title=$1 where id = $2 RETURNING * ', [_body.title, _params.id])
                        .then(function(data) {
                            res.status(200)
                                .json({
                                    status: 'success',
                                    data: data,
                                    message: 'Updated alerts successfully.'
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
                            message: 'Incorrect event.'
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
        connect.db.result('DELETE FROM alerts WHERE id = $1', _params.id)
            .then(function(result) {
                // rowCount = number of rows affected by the query
                if (result.rowCount > 0) {
                    return res.status(200)
                        .json({
                            status: 'success',
                            data: result,
                            message: 'event deleted Successfully.'
                        });
                } else {
                    return res.status(401)
                        .json({
                            status: 'fail',
                            err: "Unauthorized access.",
                            message: 'event not found.'
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

    /**
     * Delete API
     */
    changeLevelById: function deleteById(req, res, next) {
        var _params = req.params, _body = req.body;

        // validations
        if (!_params.id) {
            return res.send({ status: 0, message: 'Invalid parameters' });
        }
        // delete;
        connect.db.result('SELECT * FROM alerts WHERE id = $1', _params.id)
            .then(function(result) {
                if (event.length > 0) {
                    alerts = event[0];
                } else {
                    alerts = null
                }
                if (event && alerts != null) {
                    _body.level = _body.level ? _body.level : event.level;

                    connect.db.one('update alerts set level=$1 where id = $2 RETURNING * ', [_body.level, _params.id])
                        .then(function(data) {
                            res.status(200)
                                .json({
                                    status: 'success',
                                    data: data,
                                    message: 'Updated level of alerts successfully.'
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
                            message: 'Incorrect event.'
                        });
                }
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

        _body['created_at'] = new Date();

        // validations
        if (!_body.title) {
            return res.send({ status: 0, message: 'Invalid parameters' });
        }

        connect.db.one('INSERT INTO alerts (title, body, owner, level, created_at ) VALUES($1, $2, $3, $4) RETURNING *', [_body.title, _body.body, _body.owner, _body.level, _body.created_at])
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

    create_event: function create_event(message, io){
      var body = message.message,
        owner = message.owner,
        created_at = new Date(),
        title = message.title;

        console.log("message = ", message)

        connect.db.one('INSERT INTO alerts (title, body, owner, created_at ) VALUES($1, $2, $3, $4) RETURNING *', [title, body, owner, created_at])
            .then(function(data) {
                console.log("inserted successfully ", data)
              io.emit('broad-event', {message: body, title:title, created_at: created_at });
            })
            .catch(function(err) {
                console.log(err);
            });
    },

}