import nodemailer from "nodemailer";
import config from "../config/config.js"
import logger from "../utils/logger-env.js";

export default class MailingService {

    constructor(){
        logger.info("Mailing Constructor");
        this.client = nodemailer.createTransport({
            service: config.mailing.mail_service,
            port: config.mailing.mail_port,
            auth: {
                user: "agusluduena4@gmail.com",
                pass: "gyit reen larc zyxl",
                //No permite utilizar variables de entorno aquí? Me da error.
            }
        })
    }

    sendMail = async ({ to, subject, html, attachments=[]}) => {
        try {
            let result = await this.client.sendMail({
                from: `API Mail <${config.mailing.mail_host}>`,
                to,
                subject,
                html,
                attachments,
            })
    
            logger.info(result);
            return result;
        } catch (error) {
            logger.error("Error al enviar el correo:", error);
            throw error;
        }
    }


//     restoreMail = async ({ to, subject, html, attachments=[]}) => {
//         try {
//             let result = await this.client.sendMail({
//                 from: `API Mail <${config.mailing.mail_host}>`,
//                 to,
//                 subject,
//                 html,
//                 attachments,
//             })
    
//             logger.info(result);
//             return result;
//         } catch (error) {
//             logger.error("Error al enviar el correo:", error);
//             throw error;
//         }
//     }

}