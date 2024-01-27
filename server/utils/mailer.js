const nodemailer = require('nodemailer');
const mailgen = require('mailgen');

const transporter = nodemailer.createTransport({
    host: 'smtp.titan.email',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})

const mailGenerator = new mailgen({
    theme: 'salted',
    product: {
        name: "Wisdom RSPS",
        link: "https://www.wisdom317.com"
    }
});

const passwordResetRequest = async (email, requestId) => {
    try {
        const response = {
            body: {
                name: email,
                intro: 'You have received this email because a password reset request for your account was received',
                action: {
                    instruction: 'Click the button below to reset your password',
                    button: {
                        color: '#24102c',
                        text: 'Reset your password',
                        link: `https://www.wisdom317.com/passwordreset/${requestId}`
                    }
                },
                outro: 'This reset will expire in 1 hour from now. If you did not request a password reset, no further action is required on your part.'
            }
        }

        const mail = mailGenerator.generate(response)
        const mailtext = mailGenerator.generatePlaintext(response)

       await transporter.sendMail({
            from: `Wisdom RSPS <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Password Reset",
            text: mailtext,
            html: mail
        })
    } catch (error) {
        console.log(error)
    }
}

const passwordResetResponse = async (email) => {
    try {
        const response = {
            body: {
                name: email,
                intro: "You have received this request because your password has been changed",
                outro: "If you believe this is an error, please contact admin@wisdom317.com for further assistance."
            }
        }

        const mail = mailGenerator.generate(response)
        const mailtext = mailGenerator.generatePlaintext(response)

       await transporter.sendMail({
            from: `Wisdom RSPS <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password successfully reset',
            text: mailtext,
            html: mail
        })
    } catch (e) {
        console.log(e)
    }
}

const signUpResponse = async (email) => {
    try {
        const response = {
            body: {
                name: email,
                intro: "Welcome to Wisdom! We are glad to have you! Check out the latest forum posts below!",
            }
        }

        const mail = mailGenerator.generate(response)
        const mailtext = mailGenerator.generatePlaintext(response)

        await transporter.sendMail({
            from: `Wisdom RSPS <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Welcome to Wisdom",
            text: mailtext,
            html: mail
        })
    } catch (e) {
        console.log(e)
    }
}

module.exports = {passwordResetRequest, passwordResetResponse, signUpResponse}