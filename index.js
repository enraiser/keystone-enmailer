
var nodemailer = require('nodemailer'),
    smtp = require('nodemailer-smtp-transport'),
    Q = require('q'),
    _ = require('underscore');


if (!process.env.SITE_EMAIL_ADDRESS || !process.env. SITE_EMAIL_PASSWD || !process.env.SMTP_HOST || !process.env.SMTP_PORT) throw new Error("Expected SMTP_USER,SMTP_PASS, SMTP_HOST and SMTP_PORT env, missing one or both.");

//Also see more node mailer transport options https://github.com/nodemailer/nodemailer
var transport = nodemailer.createTransport(smtp({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    ignoreTLS: true,
    auth: {
        user: process.env.SITE_EMAIL_ADDRESS,
        pass: process.env.SITE_EMAIL_PASSWD
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
        subject: message.subject ,
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
