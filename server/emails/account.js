const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'enn.shi@gmail.com',
        subject: 'Welcome',
        text: `Hello ${name}`
    })
};

module.exports = { sendWelcomeEmail };
