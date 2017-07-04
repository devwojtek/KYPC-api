var TokenGenerator = require('uuid/v1');
// var nodemailer = require('nodemailer');
var email = require("emailjs/email");
var server = email.server.connect({
    user: " ziara.testuser",
    password: "testM@!l",
    host: "smtp.gmail.com",
    ssl: true
});

module.exports = {
    generateToken: function() {
        token = TokenGenerator();
        return token;
    },
    sendMailTo: function(receiver, subject, text, next) {
        server.send({
            text: text,
            from: 'RK Team<admin@localhost.com>',
            to: receiver,
            cc: receiver,
            subject: subject
        }, function(err, message) { 
            if (err) {
                next(err);
            } else {
                next();        
                
            }
        });
    }
};
