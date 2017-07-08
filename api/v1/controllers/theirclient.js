var config = rootRequire('./config'); // get our config file
var connect = rootRequire('./db/queries'); // local postgres connection
var helper = rootRequire('./api/v1/helper');

module.exports = {
	listAllClients: function listAllClients(req, res, next){
  //       console.log("get data")
		connect.db.any("SELECT * FROM theirclients")
    .then(function(data) {
        return res.status(200)
            .json({
                status: 'success',
                data: data,
                message: 'Retrieved ALL Clients'
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
		// _params = req.params;
  //       var id = _params.id ? _params.id : null;
  //       connect.db.any('SELECT * FROM user_group WHERE _id = $1', id)
  //           .then(function(group) {
  //               if (group.length > 0) {
  //                   group = group[0];
  //               } else {
  //                   group = null
  //               }

  //               if (group && group != null) {
  //                   return res.status(200)
  //                       .json({
  //                           status: 'success',
  //                           data: group,
  //                           message: 'User Group data fetched Successfully.'
  //                       });

  //               } else {
  //                   return res.status(401)
  //                       .json({
  //                           status: 'fail',
  //                           err: "Unauthorized access.",
  //                           message: 'User not found.'
  //                       });
  //               }
  //           })
  //           .catch(function(err) {
  //               return res.status(500)
  //                   .json({
  //                       status: 'fail',
  //                       err: err,
  //                       message: 'Something went wrong !'
  //                   });
  //           });
        res.send("hi")
	},

	updateById: function updateById(req, res, next){
		// var _body = req.body;
  //       var _params = req.params;
  //       // validations
  //       if (!_params.id) {
  //           return res.send({ status: 0, message: 'Invalid parameters' });
  //       }
  //       connect.db.any('SELECT * FROM user_group WHERE id = $1', _params.id)
  //           .then(function(group) {
  //               if (group.length > 0) {
  //                   group = group[0];
  //               } else {
  //                   group = null
  //               }
  //               if (group && group != null) {
  //                   _body.name = _body.name ? _body.name : group.name;
  //                   _body.discount = _body.discount ? _body.discount : user.discount;
  //                   _body.description = _body.description ? _body.description : user.description;
  //                   _body.role = _body.role ? _body.role : user.role;

  //                   connect.db.one('update user_group set name=$1, discount=$2, description=$3, role=$4 where id = $5 RETURNING * ', [_body.name, _body.discount, _body.description, _body.role , _params.id])
  //                       .then(function(data) {
  //                           res.status(200)
  //                               .json({
  //                                   status: 'success',
  //                                   data: data,
  //                                   message: 'Updated user group successfully.'
  //                               });
  //                       })
  //                       .catch(function(err) {
  //                           return res.status(500)
  //                               .json({
  //                                   status: 'fail',
  //                                   err: err,
  //                                   message: 'Something went wrong !'
  //                               });
  //                       });
  //               } else {
  //                   return res.status(401)
  //                       .json({
  //                           status: 'fail',
  //                           err: "Unauthorized access.",
  //                           message: 'Incorrect User Group.'
  //                       });
  //               }
  //           })
  //           .catch(function(err) {
  //               // console.log(err);
  //               return res.status(500)
  //                   .json({
  //                       status: 'fail',
  //                       err: err,
  //                       message: 'Something went wrong !'
  //                   });
  //           });

        res.send("hi")
	},


	/**
     * Delete User API
     */
    deleteClientById: function deleteClientById(req, res, next) {
        // var _params = req.params;

        // // validations
        // if (!_params.id) {
        //     return res.send({ status: 0, message: 'Invalid parameters' });
        // }
        // // delete;
        // connect.db.result('DELETE FROM user_group WHERE id = $1', _params.id)
        //     .then(function(result) {
        //         // rowCount = number of rows affected by the query
        //         if (result.rowCount > 0) {
        //             return res.status(200)
        //                 .json({
        //                     status: 'success',
        //                     data: result,
        //                     message: 'User Group deleted Successfully.'
        //                 });
        //         } else {
        //             return res.status(401)
        //                 .json({
        //                     status: 'fail',
        //                     err: "Unauthorized access.",
        //                     message: 'User Group not found.'
        //                 });
        //         }
        //         // console.log(result.rowCount); // print how many records were deleted;
        //     })
        //     .catch(function(err) {
        //         // console.log('ERROR:', error);
        //         return res.status(500)
        //             .json({
        //                 status: 'fail',
        //                 err: err,
        //                 message: 'Something went wrong !'
        //             });
        //     });
        res.send("hi")
    },

    create: function create(req, res, next) {

        var _body = req.body;

        // validations
        if (!_body.clientname) {
            return res.send({ status: 0, message: 'Invalid parameters' });
        }

        connect.db.one('INSERT INTO theirclients (clientname,clienttype,clientsince,reasonrelation, transactionsnormalfrom, transactionsnormalto, transactionsamountavg, transactionsamountmax, originfonds, ownrisk, totalrisk, risklevel, lastqualified, lastverified, lastactualised, theirclientnotes ) VALUES($1, $2, $3, $4, $5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *', [_body.clientname, _body.clienttype || '', _body.clientsince || '', _body.reasonrelation || 0, _body.transactionsnormalfrom || 0, _body.transactionsnormalto || 0, _body.transactionsamountavg || 0, _body.transactionsamountmax || 0, _body.originfonds || 0, _body.ownrisk || 0, _body.totalrisk || 0,_body.risklevel || 0, _body.lastqualified || '',_body.lastverified || '', _body.lastactualised || '',  _body.theirclientnotes || ''])
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