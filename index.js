//mailer.js exports an object that matches what Keystone expects for its Mandrill objects, allowing you to use node-mailer (in this case) for sending email.

var nodemailer = require('nodemailer'),
    smtp = require('nodemailer-smtp-transport'),
    Q = require('q'),
    _ = require('underscore');

if (!process.env.SMTP_USER || !process.env.SMTP_PASS) throw new Error("Expected SMTP_USER and SMTP_PASS env, missing one or both.");

//Also see more node mailer transport options https://github.com/nodemailer/nodemailer
var transport = nodemailer.createTransport(smtp({
    host: '',
    port: 25,
    secure: false,
    ignoreTLS: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
}));

var mapToResults = function (arr) {
    return arr.map(function (r) {
        return r.value;
    });
};

var send = function (toSend, onSuccess, onFail) {
    var message = toSend.message;
    
    if (!message.to || message.to.length === 0) {
        console.warn("WARNING: No emails found to send mail to.");
        return;
    }

    var messageBase = {
        from: "\"" + message.from_name + "\" <" + message.from_email + ">",
        subject: message.subject + " - " + Date.now(),
        html: message.html
    };

    var sendMessages = message.to.map(function (t) {
        var thisMessage = _.extend({}, messageBase, {
            to: "\"" + t.name + "\" <" + t.email + ">",
            replyTo: "\"" + t.name + "\" <" + t.email + ">"
        });

        return transport.sendMail(thisMessage);
    });

    Q.allSettled(sendMessages).done(function (results) {
        var errors = results.filter(function (r) {
            return r.state !== "fulfilled";
        });
        if (errors && errors.length > 0) {
            console.log("Errors while sending mail.");
            errors.forEach(function (e) { console.error(e); });
            onFail(mapToResults(errors));
        }
        else {
            onSuccess(mapToResults(results));
        }
    });
};

module.exports = {
    send: send,
    mandrill: {
        messages: {
            send: send,
            sendTemplate: function (a, b, c) { }
        },
        templates: {
            render: function (a, b, c) { }
        }
    }
};
