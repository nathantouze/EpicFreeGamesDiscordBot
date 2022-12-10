const { Message } = require('discord.js');
const nodeMailer = require('nodemailer');
const Constants = require("../classes/Constants");


/**
 * 
 * @param {Message} message 
 */
async function feedback(message) {

    let args = message.content.split(' ');
    if (args.length < 2) {
        await message.reply(global.i18n.__("ERROR_FEEDBACK_NO_MSG"));
        return;
    }

    let msg = args.slice(1).join(' ');

    let transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: Constants.FEEDBACK_EMAIL,
            pass: Constants.FEEDBACK_EMAIL_PASSWORD
        }
    });
    transporter.sendMail({
        from: "Feedback <" + Constants.FEEDBACK_EMAIL + ">",
        to: Constants.FEEDBACK_EMAIL,
        subject: "Feedback from " + message.author.username + "#" + message.author.discriminator,
        text: msg
    }, (err, info) => {
        if (err) {
            console.log(err);
        }
    });
    await message.reply(global.i18n.__("FEEDBACK_SENT"));
}

module.exports = feedback;