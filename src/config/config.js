import dotenv from "dotenv";

dotenv.config();
  
export default {
// Port
port: process.env.PORT,
// Mongo conecction
mongo_url: process.env.DB_URL,
// Secret for JWT Token
token: process.env.JWT_SECRET,
// Factory
persistence: process.env.PERSISTENCE,
// Entorno de desarrollo / producción
env: process.env.NODE_ENV || "production",
// Mailing
mailing: {
    mail_host: process.env.HOST,
    mail_pass: process.env.MAIL_PASSWORD,
    mail_service: process.env.MAIL_SERVICE,
    mail_port: process.env.MAIL_PORT,
}
};