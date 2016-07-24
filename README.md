![enRaiser : ](https://www.enraiser.com/mod/enraiser/graphics/site_logo.png) keystone-enmailer
=====

sending SMTP mail with Jade template 

## Installation

1. create keystone project using yo keystone, and do not choose email feature.
2. install keystone-enmailer

    npm install git+https://git@github.com/enraiser/keystone-enmailer.git

## Usage
   
1. In keystone.js at keystone.init add email template
   ```javascript
   keystone.init({
        ... 
        'emails': 'templates/emails',
   });
   ```

2. add globals in .env file

    ```
     SMTP_HOST=us2.smtp.mailhostbox.com'
     
     SMTP_PORT=587

    SMTP_USER=admin@lastwish.me

    SMTP_PASS=*********
    ```

3.  create welcome.jade in templates/emails folder

4. now wherever you want to send mail  add this code

   ```javascript
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
   ```

