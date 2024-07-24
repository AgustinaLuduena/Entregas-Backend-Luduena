//Factory
import { mailingService } from '../dao/factory.js';
//Logger
import logger from '../utils/logger-env.js';
//Restore Mail Token
import { generateRestorePassToken } from '../utils/utils.js';


export const restoreRequest = async (req, res) => {
    try {
        const {email} = req.body
        if(!email){
            return res.status(400).json({ status: "error", error: "Please, complete all the information require."});
        }
        const token = generateRestorePassToken(email);
        const restoreLink = `http://localhost:8081/restore?token=${token}`;
        
        let mailData = {
            to: email,
            subject: "Restaurá tu contraseña",
            html: `
            <div>
                <h2> Restaurá tu contraseña </h2>
                <a href="${restoreLink}"> Hace click aquí y serás redireccionado para restablecer tu contraseña.</a>
            </div>
            `,
            attachments: [],
        };

        await mailingService.restoreMail(mailData)
        logger.info(`Correo para restaurar la contraseña enviado exitosamente a ${email}.`);
        res.status(200).json({message: "Correo para restaurar la contraseña enviado exitosamente. Ingrese al link que figurará allí."})
    } catch (error) {
        logger.error("Error al enviar el correo:", error);
        throw error;
    }
}

export const deletedAcountNotification = async (email, inactiveLimitdate) => {
    try {
        //const {email} = req.body
        if(!email){
            return res.status(400).json({ status: "error", error: "Please, complete all the information require."});
        }
        // const token = generateRestorePassToken(email);
        // const restoreLink = `http://localhost:8081/restore?token=${token}`;
        const createUserLink = `http://localhost:8081/register`;
        const limitTime = 1
        
        let mailData = {
            to: email,
            subject: "Nuevo aviso: tu cuenta ha sido eliminada.",
            html: `
            <div>
                <h2> Tu cuenta ha sido eliminada </h2>
                <div>
                    <a> Hemos recibido un aviso de que tu cuenta se encuentra inactiva hace más de ${limitTime} minuto y por ello hemos decidido eliminarla.<a>
                </div>
                <div>
                    <a href="${createUserLink}"> Si deseas crear una nueva cuenta, haz click aquí y serás redireccionado a nuestra web.</a>
                </div>
                <div>
                    <a> Ante cualquier duda, no dudes en contactarte.<a>
                </div>
                <h4> Lamentamos cualquier molestia que pudieramos ocasionar. </h4>
            </div>
            `,
            attachments: [],
        };

        await mailingService.deletedAcountMail(mailData)
        logger.info(`Correo para avisar de la eliminación de una cuenta por inactividad, enviado exitosamente a ${email}.`);
        //res.status(200).json({message: "Correo para avisar de la eliminación de una cuenta por inactividad, enviado exitosamente."})
    } catch (error) {
        logger.error("Error al enviar el correo:", error);
        throw error;
    }
}