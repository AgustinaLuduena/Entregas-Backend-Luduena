import winston from "winston";
import config from "../config/config.js";

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1, 
        warning: 2, 
        info: 3, 
        http: 4, 
        debug: 6
    },
    colors: {
        debug: "cyan",
        http: "green", 
        info: "blue", 
        warning: "yellow", 
        error: "magenta", 
        fatal: "red"
    },
  };

//Default transport (for dev)
let consoleTransport = new winston.transports.Console({
  level: "debug",
  format: winston.format.combine(
      winston.format.colorize({ colors: customLevelOptions.colors }),
      winston.format.simple()
  )
});

//Level change (for production)
if (config.env === 'production') {
  consoleTransport = new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
          winston.format.colorize({ colors: customLevelOptions.colors }),
          winston.format.simple()
      )
  });
}

//File transport for errors y fatals
const fileTransport = new winston.transports.File({
  filename: './errors.log',
  level: 'error',
  format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
  )
});

//Logger
const logger = winston.createLogger({
  levels: customLevelOptions.levels,
  transports: [
    consoleTransport, 
    fileTransport
  ]
});


//Logger middleware
export const loggerMiddleware = (req, res, next) => {
  req.logger = logger;
  req.logger.http(`${req.method} at ${req.url} - ${new Date().toLocaleDateString()}`)
  next();
};

export default logger;