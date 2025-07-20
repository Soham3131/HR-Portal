const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create a transporter object using the Gmail service
    // This is a more reliable method than specifying the host and port manually.
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use the built-in Gmail service
        auth: {
            user: process.env.EMAIL_USER, // Your Gmail address from .env
            pass: process.env.EMAIL_PASS, // Your Gmail App Password from .env
        },
    });

    // 2. Define the email options
    const mailOptions = {
        from: `AVANI ENTERPRISES <${process.env.EMAIL_USER}>`,
        to: options.to,
        cc: options.cc,
        subject: options.subject,
        html: options.html,
    };

    // 3. Send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        // This will help you see more detailed errors in your backend console
        throw new Error('Email could not be sent. Please check server logs and ensure your EMAIL_PASS is a valid App Password.');
    }
};

module.exports = sendEmail;