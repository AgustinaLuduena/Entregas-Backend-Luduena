import jwt from 'jsonwebtoken';
import config from "../config/config.js";
//ErrorHandler
import { CustomError } from '../errorsHandlers/customError.js';
import { errorTypes } from '../errorsHandlers/errorTypes.js';
import { loginError, authError, authorizationError } from "../errorsHandlers/productsError.js";
//Logger
import logger from '../utils/logger-env.js';
//Managers
import { userManager } from '../dao/factory.js';

//auth with session
export function auth (req, res, next) {
    if (!req.session || !req.session.user) {
      return res.redirect("/login");
    }
    next();
  }


//Middleware para verificar que el usuario haya iniciado sesión correctamente.
export const verifyToken = (req, res, next) => {
    const token = req.cookies[config.token];
    if (!token) {
      throw CustomError.CustomError(
        "Error", `Plese, login to continue.`, 
        errorTypes.ERROR_AUTHENTICATION, 
        loginError())
    }

    try {
        const decoded = jwt.verify(token, config.token);
        req.user = decoded;
        next();
    } catch (error) {
        throw CustomError.CustomError(
          "Error", `Invalid Token.`, 
          errorTypes.ERROR_UNAUTHORIZED, 
          authError())
    }
};

//Middleware para verificar si es un usuario.
export const verifyUser = (req, res, next) => {
    const token = req.cookies[config.token];

    if (!token) {
        req.user = null;
        return next();
    }

    jwt.verify(token, config.token, (err, decoded) => {
        if (err) {
            req.user = null;
        } else {
            req.user = decoded; 
        }
        next();
    });
};

// Middleware de autenticación ADMIN
export const checkAdminRole = (req, res, next) => {
    const token = req.cookies[config.token];
    if (!token) {
      throw CustomError.CustomError(
        "Error", `Access denied.`, 
        errorTypes.ERROR_AUTHENTICATION, 
        authError())
    }
    try {
        const decoded = jwt.verify(token, config.token);
        req.user = decoded;
        const userRole = req.user.user.role;

        let requiredRoles = ["admin"]

        if(requiredRoles.includes(userRole)){
          logger.info(userRole)
          return next();
        }

        throw CustomError.CustomError(
          "Error", `Unauthorized user.`, 
          errorTypes.ERROR_UNAUTHORIZED, 
          authorizationError())

    } catch (error) {
        throw CustomError.CustomError(
          "Error", `Invalid Token.`, 
          errorTypes.ERROR_UNAUTHORIZED, 
          authError())
    }
  };

// Middleware de autenticación USER
  export const checkUserRole = async (req, res, next) => {
    const token = req.cookies[config.token];
    if (!token) {
      throw CustomError.CustomError(
        "Error", `Access denied.`, 
        errorTypes.ERROR_AUTHENTICATION, 
        authError())
    }

    try {
        const decoded = jwt.verify(token, config.token);
        req.user = decoded;
        
        let user = req.user.user
        if(!user) {return res.status(404).json({ error: 'Usuario no encontrado' });}
        let checkDB = await userManager.getById(user._id)
        if(checkDB.role === 'User') {
          logger.info(checkDB.role)
          return next();
        } else {
          return res.status(403).json({ error: 'Acceso no autorizado' });
        }

    } catch (error) {
        return res.status(403).json({ error: 'Acceso no autorizado' });
    }
  };

  // Middleware de autenticación USER PREMIUM
  export const checkPremiumRole = (req, res, next) => {
    const token = req.cookies[config.token];
    if (!token) {
      throw CustomError.CustomError(
        "Error", `Access denied.`, 
        errorTypes.ERROR_AUTHENTICATION, 
        authError())
    }

    try {
        const decoded = jwt.verify(token, config.token);
        req.user = decoded;
        const userRole = req.user.user.role;

        let requiredRoles = ["Premium"]

        if(requiredRoles.includes(userRole)){
          logger.info(userRole)
          return next();
        }

        throw CustomError.CustomError(
          "Error", `Unauthorized user.`, 
          errorTypes.ERROR_UNAUTHORIZED, 
          authorizationError())

    } catch (error) {
        throw CustomError.CustomError(
          "Error", `Invalid Token.`, 
          errorTypes.ERROR_UNAUTHORIZED, 
          authError())
    }
  };


export const isUserOrPremium = async (req, res, next) => {
    let user = req.user.user
    if(!user) {return res.status(404).json({ error: 'Usuario no encontrado' });}

    let checkDB = await userManager.getById(user._id)

    if(checkDB && checkDB.role === 'User' || checkDB.role === 'Premium') {
        next();
    }
    else {
        return res.status(403).json({ error: 'Acceso no autorizado' });
    }
}

export const isPremiumOrAdmin = async (req, res, next) => {
  let user = req.user.user
  if(!user) {return res.status(404).json({ error: 'Usuario no encontrado' });}

  let checkDB = await userManager.getById(user._id)
  if(checkDB.role === 'Premium' || checkDB.role === 'admin') {
      next();
  }
  else {
      return res.status(403).json({ error: 'Acceso no autorizado' });
  }
}
