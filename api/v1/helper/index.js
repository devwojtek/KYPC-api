var TokenGenerator = require('uuid/v1');
// var nodemailer = require('nodemailer');
var email = require("emailjs/email");
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport({
   host: '127.0.0.1',
   port: 25
}));

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
        transporter.sendMail({
           from: 'support@zairasoft.com',
           to: receiver,
           subject: support,
           html: text,
           text: text
        });

        next()
    }
};
