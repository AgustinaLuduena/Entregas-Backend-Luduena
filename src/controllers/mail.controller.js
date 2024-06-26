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