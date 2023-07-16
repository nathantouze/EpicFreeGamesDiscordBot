const { Interaction, CommandInteractionOptionResolver } = require('discord.js');
const nodeMailer = require('nodemailer');
const Constants = require("../classes/Constants");


/**
 * Sends feedback to the bot owner
 * @param {Interaction} interaction 
 * @param {CommandInteractionOptionResolver} options
 */
async function feedback(interaction, options) {

    let msg = options.getString("message");

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
        subject: "Feedback from " + interaction.member.user.username + "#" + interaction.member.user.discriminator,
        text: msg
    }, (err, info) => {
        if (err) {
            console.log(err);
        }
    });

    const local_feedback_sent = {
        "fr": `Feedback envoyé`,
        "en-US": `Feedback sent`,
        default: `Feedback sent`
    }

    await interaction.reply(local_feedback_sent[interaction.locale] || local_feedback_sent.default);
}

module.exports = feedback;