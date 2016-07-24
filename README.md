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

    ```html
    block body-contents
        h1 Hi #{first_name},
        p.text-larger We would like to verify your EmailID to enroll you on #{brand}.
        p.text-larger click&nbsp;
            a(href='#{link}') 
                strong this link
            |  &nbsp; to complete this verification.
    ```

4. now wherever you want to send mail  add this code

   ```javascript
   var enmailer('keystone-enmailer');

   var Email = new keystone.Email('welcome');
   var brand = keystone.get('brand');
   Email.send({
       mandrill: enmailer.mandrill,
       first_name: 'Sachin Sharma',
       link: "action/verify?user_id=" +newUser._id,
       subject: 'Please verify your email',
       to: "someone@somewhere.com",
       from: {
            name:brand,
            email: process.env.SMTP_USER
        }
   });
   ```

