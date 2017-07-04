// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Event', new Schema({ 
    title: String, 
    owner: String,
    body: String,
    createdAt: Date,
    id: integer
}));