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
// export function auth (req, res, next) {
//     if (!req.session || !req.session.user) {
//       return res.redirect("/login");
//     }
//     next();
//   }

export const verifyHeaderToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        req.user = null;
        return next();
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, config.token, (err, decoded) => {
        if (err) {
            req.user = null;
        } else {
            req.user = decoded;
        }
        next();
    });
};

//Verify for active login
export const verifyToken = (req, res, next) => {
  const token = req.cookies[config.token];
  if (!token) {
      return res.status(401).json({
          error: 'Please login to continue.'
      });
  }

  try {
      const decoded = jwt.verify(token, config.token);
      req.user = decoded;
      next();
  } catch (error) {
      return res.status(401).json({
          error: 'Invalid Token.'
      });
  }
};

//Verify if it is a register user or a guest
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

//Verify admin auth
  export const checkAdminRole = (req, res, next) => {
    const token = req.cookies[config.token];
    if (!token) {
        return res.status(401).json({
            error: 'Access denied.'
        });
    }

    try {
        const decoded = jwt.verify(token, config.token);
        req.user = decoded;
        const userRole = req.user.user.role;

        if (userRole === 'admin') {
            logger.info(userRole);
            next();
        } else {
            return res.status(403).json({
                error: 'Unauthorized user.'
            });
        }
    } catch (error) {
        return res.status(401).json({
            error: 'Invalid Token.'
        });
    }
};

////Verify user auth
  export const checkUserRole = async (req, res, next) => {
    const token = req.cookies[config.token];
    if (!token) {
        return res.status(401).json({
            error: 'Access denied.'
        });
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
          return res.status(403).json({
            error: 'Unauthorized user.'
        });
        }
    } catch (error) {
        return res.status(401).json({
            error: 'Invalid Token.'
        });
    }
};

  //Verify user "premium" auth
  export const checkPremiumRole = (req, res, next) => {
    const token = req.cookies[config.token];
    if (!token) {
        return res.status(401).json({
            error: 'Access denied.'
        });
    }

    try {
        const decoded = jwt.verify(token, config.token);
        req.user = decoded;
        const userRole = req.user.user.role;

        if (userRole === 'Premium') {
            logger.info(userRole);
            next();
        } else {
            return res.status(403).json({
                error: 'Unauthorized user.'
            });
        }
    } catch (error) {
        return res.status(401).json({
            error: 'Invalid Token.'
        });
    }
};

//Verify if it is USER or PREMIUM
export const isUserOrPremium = async (req, res, next) => {
    let user = req.user.user
    if(!user) {return res.status(404).json({ error: 'Usuario no encontrado' });}
    if(user.role === "admin") {return res.status(401).json({ error: 'Unauthorized user' });}

    let checkDB = await userManager.getById(user._id)

    if(checkDB && checkDB.role === 'User' || checkDB.role === 'Premium') {
        next();
    }
    else {
        return res.status(403).json({ error: 'Acceso no autorizado' });
    }
}

//Verify if it is PREMIUM or ADMIN
export const isPremiumOrAdmin = async (req, res, next) => {
  let user = req.user.user
  if(!user) {return res.status(404).json({ error: 'Usuario no encontrado' });}
  if(user.role === 'admin') {
    next();
  } else {
    let checkDB = await userManager.getById(user._id)
    if(checkDB.role === 'Premium') {
        next();
    } else {
      return res.status(403).json({ error: 'Acceso no autorizado' });
    }
  }
  
}
