var debug = require('debug')('demo:controllers:user');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var sha1 = require('sha1');
var config = rootRequire('./config'); // get our config file
var connect = rootRequire('./db/queries'); // local postgres connection
var helper = rootRequire('./api/v1/helper');
var path = require('path');
var async = require('async');
var crypto = require('crypto');
module.exports = {

    /**
     * TEST API CTRL
     */
    testCtrl: function testCtrl(req, res, next) {
        res.send('OK');
    },

    /**
     * Login API
     * @params {username, password}
     * @response
     *  - jwt token
     */
    login: function login(req, res, next) {

        console.log("login")

        var _body = req.body;
        // _body = JSON.parse(Object.keys(_body)[0]);

        // validations
        if (!_body.username || !_body.password) {
            return res.send({ status: 0, message: 'Invalid parameters' });
        }

        connect.db.any('SELECT * FROM users WHERE username = $1', _body.username)
            .then(function(user) {

                if (user.length > 0) {
                    user = user[0];
                } else {
                    user = null
                }

                if (user && user != null) {
                    if (user.password == _body.password && user.active == true) {
                        // if sign in success
                        jwt.sign({username: user.username, password: user.password}, config.secret, function(err, token) {
                            return res.status(200)
                                .json({
                                    status: 'success',
                                    data: { token: token, user: user },
                                    message: 'User logged in Successfully.'
                                });
                            // return res.send({ status: 1, message: 'success', data: { token: token } });
                        });
                    } else {
                        return res.status(401)
                            .json({
                                status: 'fail',
                                err: "Unauthorized access.",
                                message: 'Incorrect Email / Password combination.'
                            });
                    }
                } else {
                    return res.status(401)
                        .json({
                            status: 'fail',
                            err: "Unauthorized access.",
                            message: 'Incorrect Email / Password combination.'
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
    },

    /**
     * Login API
     * @params {username, password}
     * @response
     *  - jwt token
     */
    signup: function signup(req, res, next) {

        debug('SIGN UP:', req.body);
        var _body = req.body;

        // validations
        if (!_body.email || !_body.password) {
            return res.send({ status: 0, message: 'Invalid parameters' });
        }
        var token = helper.generateToken();

        var receiver = _body.email;
        var subject = "Verify Registration !";
        var text = "http://localhost:8000/v1/api/verify?email=" + _body.email + "&token=" + token;

        // connect.db.one('INSERT INTO users (email,password,username,active,token) VALUES($1, $2, $3, $4, $5) RETURNING *', [_body.email, _body.password, _body.email, false, token])
        // .then(function(data) {
        //     return res.status(200)
        //         .json({
        //             status: 'success',
        //             data: data,
        //             message: 'You are registerd successfully. Please verify your account from your email account'
        //         });
        // })
        // .catch(function(err) {
        //     console.log(err);
        //     return res.status(500)
        //         .json({
        //             status: 'fail',
        //             err: err,
        //             message: 'Something went wrong !'
        //         });
        // });

        helper.sendMailTo(receiver, subject, text, function(err, result) {
            if (err) {
                console.log(err)
                return res.status(500)
                    .json({
                        status: 'fail',
                        err: err,
                        message: 'Something went wrong. Email failed. !'
                    });
            }else{
                connect.db.one('INSERT INTO users (email,password,username,active,token) VALUES($1, $2, $3, $4, $5) RETURNING *', [_body.email, _body.password, _body.email, false, token])
                    .then(function(data) {
                        return res.status(200)
                            .json({
                                status: 'success',
                                data: data,
                                message: 'You are registerd successfully. Please verify your account from your email account'
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
                
            }
            // do for sending email of verification
            // return res.send({ status: 1, message: "You are registerd successfully. Please verify your account from your email account" });
        });
    },

    /**
     * List Users API
     */
    listUser: function listUser(req, res, next) {
        _params = req.params;
        var username = _params.username ? _params.username : null;
        connect.db.any('SELECT * FROM users WHERE username = $1', username)
            .then(function(user) {
                if (user.length > 0) {
                    user = user[0];
                } else {
                    user = null
                }

                if (user && user != null) {
                    return res.status(200)
                        .json({
                            status: 'success',
                            data: user,
                            message: 'User data fetched Successfully.'
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
    },

    /**
     * Delete User API
     */
    deleteUserByID: function deleteUserByID(req, res, next) {
        var _params = req.params;

        // validations
        if (!_params.username) {
            return res.send({ status: 0, message: 'Invalid parameters' });
        }
        // delete;
        connect.db.result('DELETE FROM users WHERE username = $1', _params.username)
            .then(function(result) {
                // rowCount = number of rows affected by the query
                if (result.rowCount > 0) {
                    return res.status(200)
                        .json({
                            status: 'success',
                            data: result,
                            message: 'User deleted Successfully.'
                        });
                } else {
                    return res.status(401)
                        .json({
                            status: 'fail',
                            err: "Unauthorized access.",
                            message: 'User not found.'
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
     * Update User
     * @params {userid, firstname, lastname, email, phone, photo, company}
     * @response
     *  - groupid
     */
    updateUserByID: function updateUserByID(req, res, next) {

        var _body = req.body;
        var _params = req.params;
        // validations
        if (!_params.username) {
            return res.send({ status: 0, message: 'Invalid parameters' });
        }
        connect.db.any('SELECT * FROM users WHERE username = $1', _params.username)
            .then(function(user) {
                if (user.length > 0) {
                    user = user[0];
                } else {
                    user = null
                }
                if (user && user != null) {
                    _body.email = _body.email ? _body.email : user.email;
                    _body.username = _body.username ? _body.username : user.username;
                    _body.firstname = _body.firstname ? _body.firstname : user.firstname;
                    _body.lastname = _body.lastname ? _body.lastname : user.lastname;
                    _body.telephone = _body.telephone ? _body.telephone : user.telephone;
                    _body.callphone = _body.callphone ? _body.callphone : user.callphone;
                    _body.title = _body.title ? _body.title : user.title;
                    _body.position = _body.position ? _body.position : user.position;
                    _body.active = _body.active ? Boolean(_body.active) : user.active;

                    connect.db.one('update users set email=$1, username=$2, firstname=$3, lastname=$4, telephone=$5, callphone = $6, title = $7, position = $8, active = $9 where username = $10 RETURNING * ', [_body.email, _body.username, _body.firstname, _body.lastname, _body.telephone, _body.callphone, _body.title, _body.position, _body.active, _params.username])
                        .then(function(data) {
                            res.status(200)
                                .json({
                                    status: 'success',
                                    data: data,
                                    message: 'Updated user successfully.'
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
                            message: 'Incorrect User.'
                        });
                }
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

    /**
     * List All Users API
     */
    listAllUsers: function listAllUsers(req, res, next) {
        connect.db.any("SELECT * FROM users")
            .then(function(data) {
                return res.status(200)
                    .json({
                        status: 'success',
                        data: data,
                        message: 'Retrieved ALL Users'
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
    },

    verifyEmail: function verifyEmail(req, res, next) {
        debug('Verify:', req.body);
        var _query = req.query;

        // validations
        if (!_query.email || !_query.token) {
            return res.send({ status: 0, message: 'Invalid parameters' });
        }
        connect.db.any('SELECT * FROM users WHERE email = $1', _query.email)
            .then(function(user) {
                if (user.length > 0) {
                    user = user[0];
                } else {
                    user = null
                }
                if (user && user != null) {
                    if (user.token == _query.token && user.active == false) {
                        connect.db.any('update users set active=$1, token=$2 where email=$3 RETURNING *', [true, null, _query.email])
                            .then(function(data) {
                                if (data.length > 0) {
                                    data = data[0];
                                } else {
                                    data = null;
                                }
                                res.status(200)
                                    .json({
                                        status: 'success',
                                        data: data,
                                        message: 'User verified successfully !'
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
                                message: 'Incorrect Email / Password combination.'
                            });
                    }
                } else {
                    return res.status(401)
                        .json({
                            status: 'fail',
                            err: "Unauthorized access.",
                            message: 'Incorrect Email / Password combination.'
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
    },

    forgotPassword: function forgotPassword(req, res, next) {
        var _body = req.body;
        // validations
        if (!_body.email || !_body.phone) {
            return res.send({ status: 0, message: 'Invalid parameters' });
        }
        async.waterfall([
            function(done) {
                crypto.randomBytes(20, function(err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function(token, done) {
                connect.db.any('SELECT * FROM users WHERE email = $1', _body.email)
                    .then(function(user) {
                        if (user.length > 0) {
                            user = user[0];
                        } else {
                            user = null
                        }
                        if (user && user != null && user.active == true && user.token == null) {
                            var receiver = _body.email;
                            var subject = "Password Resest Request!";
                            var text = "http://localhost:8080/v1/api/verify?email=" + _body.email + "&token=" + token;
                            helper.sendMailTo(receiver, subject, text, function(err, result) {
                                if (err) {
                                    return res.status(500)
                                        .json({
                                            status: 'fail',
                                            err: err,
                                            message: 'Something went wrong. Email failed. !'
                                        });
                                }
                                connect.db.one('update users set token=$1 where email=$2 RETURNING * ', [token, _body.email])
                                    .then(function(data) {
                                        data.link = text;
                                        return res.status(200)
                                            .json({
                                                status: 'success',
                                                data: data,
                                                message: 'Link for reset password sent successfully.'
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
                                // do for sending email of verification
                                // return res.send({ status: 1, message: "You are registerd successfully. Please verify your account from your email account" });
                            });
                        } else {
                            return res.status(401)
                                .json({
                                    status: 'fail',
                                    err: "Unauthorized access.",
                                    message: 'Incorrect Email / Password combination.'
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
                // User.findOne({ email: req.body.email }, function(err, user) {
                //     if (!user) {
                //         req.flash('error', 'No account with that email address exists.');
                //         return res.redirect('/forgot');
                //     }

                //     user.resetPasswordToken = token;
                //     user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                //     user.save(function(err) {
                //         done(err, token, user);
                //     });
                // });
            },
            function(token, user, done) {
                var smtpTransport = nodemailer.createTransport('SMTP', {
                    service: 'SendGrid',
                    auth: {
                        user: '!!! YOUR SENDGRID USERNAME !!!',
                        pass: '!!! YOUR SENDGRID PASSWORD !!!'
                    }
                });
                var mailOptions = {
                    to: user.email,
                    from: 'passwordreset@demo.com',
                    subject: 'Node.js Password Reset',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };
                smtpTransport.sendMail(mailOptions, function(err) {
                    req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                    done(err, 'done');
                });
            }
        ], function(err) {
            if (err) return next(err);
            res.redirect('/forgot');
        });
    },
     createProfile: function(req, res, next) {

        var _body = req.body;

        // validations
        if (!_body.username || !_body.firstname || !_body.lastname || !_body.password || !_body.email) {
            return res.send({ status: 0, message: 'Invalid parameters' });
        }
        connect.db.one('INSERT INTO users (username,firstname,lastname,title,role, position, password, telephone, callphone, email, alerthi, alertlo, alertmed, saltpw, saltreport, active, originalip, signature, usernotes) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19) RETURNING *', [_body.username,_body.firstname, _body.lastname, _body.title || '', _body.role || '', _body.position || '', _body.password, _body.telephone || '', _body.callphone || '', _body.email || '', _body.alerthi || '', _body.alertlo || '', _body.alertmed || '', _body.saltpw || '', _body.saltreport || '', _body.active || false, _body.originalip || '', _body.signature || '', _body.usenotes])
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

    uploadImage: function(req, res, next) {
        var _body = req.body;
        var _params = req.params;

        // validations
        if (!_params.username) {
            return res.send({ status: 0, message: 'Invalid parameters' });
        }
        var sampleFile,
                filename = (new Date % 9e6).toString(36);

        if (!req.files) {
            return res.send({ status: 0, message: 'no uploaded image' });   
        }

        sampleFile = req.files.uploads;
        console.log(sampleFile);
        filename = (filename + sampleFile.name).replace(/\s+/g, '_');

        var filePath = path.join(__dirname, '../../../../upload/', filename);

        console.log(filePath)

        sampleFile.mv(filePath, function (err) {
            if (err) {
                res.status(500).send(err);
            } else {
                // upload
                connect.db.any('SELECT * FROM users WHERE username = $1', _params.username)
                    .then(function(user) {
                        if (user.length > 0) {
                            user = user[0];
                        } else {
                            user = null
                        }
                        if (user && user != null) {
                            _body.image = _body.image;

                            connect.db.one('update users set image=$1 where username = $2 RETURNING * ', ['upload/' + filename, _params.username])
                                .then(function(data) {
                                    res.status(200)
                                        .json({
                                            status: 'success',
                                            user: data,
                                            message: 'image uploaded successfully.'
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
                                    message: 'Incorrect User.'
                                });
                        }
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
                
            }
        });
    },

    setUserRole: function(req,res, next) {
        var _body = req.body;

        if (!_body.role || !_body.users) {
            return res.send({ status: 0, message: 'Invalid parameters' });
        }

        _body.users = _body.users.split(',')

        console.log(_body.users);

        for(var i=0; i<_body.users.length; ++i){
            var user_id = _body.users[i]
            console.log(_body.users[i])
            
            connect.db.any('SELECT * FROM users WHERE id = $1', user_id)
                .then(function(user) {

                    if (user.length > 0) {
                        user = user[0];
                    } else {
                        user = null
                    }
                    if (user && user != null) {
                        connect.db.one('update users set role=$1 where id = $2 RETURNING * ', [_body.role, user_id])
                            .then(function(data) {
                                console.log('i = ', i)
                                console.log('length = ', _body.users.length)
                                console.log((i+1) == _body.users.length)

                                if(i == _body.users.length) {
                                    res.status(200)
                                        .json({
                                            status: 'success',
                                            message: 'user role uploaded successfully.'
                                        });                                    
                                }
                            })
                            .catch(function(err) {
                                console.log(err)
                                return res.status(500)
                                    .json({
                                        status: 'fail',
                                        err: err,
                                        message: 'So mething went wrong !'
                                    });
                            });
                    } else {
                        return res.status(401)
                            .json({
                                status: 'fail',
                                err: "Unauthorized access.",
                                message: 'Incorrect User.'
                            });
                    }
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
        }
    }
};
