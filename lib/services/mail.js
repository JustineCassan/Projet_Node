'use strict';

const { Service } = require('schmervice');
const Nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

const transporteur = Nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '', // ajout du mail
        pass: ''  // ajout du mot de passe
    }
});

const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        name: 'Mailgen',
        link: 'https://mailgen.js/'
    }
});


module.exports = class MailService extends Service {

    async sendMailsChange(user, changedInfos) {

        const donnee = [];

        if (changedInfos.hasOwnProperty('password')) {
            donnee.push(
                {
                    item: 'password',
                    information: changedInfos.password
                }
            );
        }

        if (changedInfos.hasOwnProperty('login')) {
            donnee.push(
                {
                    item: 'login',
                    information: changedInfos.login
                }
            );
        }

        const emailChange = {
            body: {
                name: user.firstname + ' ' + user.lastname,
                intro: `Change of identifier`,
                table: {
                    data: donnee,
                    columns: {
                        customWidth: {
                            item: '20%',
                            price: '15%'
                        },
                        customAlignment: {
                            price: 'right'
                        }
                    }

                },
                outro: 'Si vous n\'avez pas demandé de réinitialisation de mot de passe, aucune action supplémentaire n\'est requise de votre part.'
            }
        };


        // Generate an HTML email with the provided contents
        const emailBody = mailGenerator.generate(emailChange);

        // Generate the plaintext version of the e-mail (for clients that do not support HTML)
        const emailText = mailGenerator.generatePlaintext(emailChange);

        const mailOptions = {
            from: '', // ajout du mail de l'expéditeur
            to: user.email, // liste des différents destinataire
            subject: '', // Ecrire le sujet du mail
            html: emailBody,
            text: emailText
        };

        await transporteur.sendMail(mailOptions,(err, info) => {

            if (err) {
                throw (err);
            }
        });
    }

    async sendMails(user) {


        const emailSubscription = {
            body: {
                name: user.firstname + ' ' + user.lastname,
                intro: `Merci`,
                table: {
                    data: [
                        {
                            item: 'login',
                            information: user.login
                        },
                        {
                            item: 'password',
                            information: user.password
                        }
                    ],
                    columns: {
                        customWidth: {
                            item: '20%',
                            price: '15%'
                        },
                        customAlignment: {
                            price: 'right'
                        }
                    }

                },
                outro: 'Si vous n\'avez pas demandé de réinitialisation de mot de passe, aucune action supplémentaire n\'est requise de votre part.'
            }
        };

        const emailBody = mailGenerator.generate(emailSubscription);

        const emailText = mailGenerator.generatePlaintext(emailSubscription);

        const mailOptions = {
            from: '', // ajout du mail de l'expéditeur
            to: user.email,
            subject: '', // ajout d'un sujet pour le mail
            html: emailBody,
            text: emailText
        };

        await transporteur.sendMail(mailOptions,(err, info) => {

            if (err) {
                throw (err);
            }
        });
    }
};
