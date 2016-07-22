keystone-enmailer
=====

**sending SMTP mail with Jade template **
## Installation

(1)create keystone project using yo keystone, and do not choose email feature.
(2) npm install git+https://git@github.com/enraiser/keystone-enmailer.git
(3)in keystone.js at keystone.init add email template

keystone.init({
         ……
        'emails': 'templates/emails',

});

(4)add globals in .env file

SMTP_USER=admin@lastwish.me
SMTP_PASS=*********

(5) create welcome.jade in templates/emails folder

(6) no wherever you want to send mail  add this code

var enmailer('keystone-enmailer');

var Email = new keystone.Email('welcome');
Email.send({
    mandrill: enmailer.mandrill,
    comments: "the comments",
    subject: 'the subject',
    to: "someone@somewhere.com",
    from: {
        name: 'Sachin Sharma',
        email: 'admin@lastwish.me'
    }
});

