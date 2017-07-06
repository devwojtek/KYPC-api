var config = rootRequire('./config'); // get our config file
var connect = rootRequire('./db/queries'); // local postgres connection
var helper = rootRequire('./api/v1/helper');

module.exports = {
	listAllEntities: function listAllEntities(req, res, next){
    console.log("get data")
		connect.db.any("SELECT * FROM entities")
    .then(function(data) {
        return res.status(200)
            .json({
                status: 'success',
                data: data,
                message: 'Retrieved ALL Entities'
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
    deleteEntityById: function deleteEntityById(req, res, next) {
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
        if (!_body.firstname) {
            return res.send({ status: 0, message: 'Invalid parameters' });
        }
        connect.db.one('INSERT INTO entities (birthincorpcountry,economicactivity,entitynote, firstname, lasrnamemarried, lastnamemother, freezone, email, googlepep,googlesearchscore, homeaddress, id1, id2, nationality, othername, ownrisk,pep, pepfunction,pepxrelation, phonecell, phonehome, phonework, pobox, profession, residencecountry, sharepercentage, totalrisk, workaddress) VALUES($1, $2, $3, $4, $5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28) RETURNING *', [_body.birthincorpcountry || '', _body.economicactivity || '', _body.entitynote || '', _body.firstname || '', _body.lastnamemarried || '', _body.lastnamemother || '', _body.freezone || 0, _body.email || '', _body.googlepep || 0, _body.googlesearchscore || 0,_body.homeaddress || '', _body.id1 || '', _body.id2 || '', _body.nationality || '', _body.othername || '', _body.ownrisk || 0, _body.pep || '', _body.pepfunction || '', _body.pepxrelation || '', _body.phonecell || '', _body.phonehome || '', _body.phonework || '', _body.pobox || '', _body.profession || '', _body.residencecountry || '' , _body.sharepercentage || 0 , _body.totalrisk || 0 , _body.workaddress || ''  ])
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