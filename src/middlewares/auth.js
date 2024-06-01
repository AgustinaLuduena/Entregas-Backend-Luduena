import jwt from 'jsonwebtoken';
//import userModel from "../dao/models/users.js";
import config from "../config/config.js";

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
    if (!token) return res.status(403).json('Por favor, inicie sesión para acceder.');

    try {
        const decoded = jwt.verify(token, config.token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).send('Invalid token');
    }
};

//Middleware para verificar si es un usuario.
export const verifyUser = (req, res, next) => {
    const token = req.cookies[config.token]; // Asegúrate de que el nombre de la cookie coincide

    if (!token) {
        req.user = null; // Si no hay token, asigna null a req.user
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
    if (!token) return res.status(403).send('Access denied');

    try {
        const decoded = jwt.verify(token, config.token);
        req.user = decoded;
        const userRole = req.user.user.role;

        let requiredRoles = ["admin"]

        if(requiredRoles.includes(userRole)){
          console.log(userRole)
          return next();
        }

        return res.status(403).json({ message: 'Acceso no autorizado a este usuario' });

    } catch (error) {
        res.status(401).json({ error: { message: 'Invalid token'}});
    }
  };

// Middleware de autenticación USER
  export const checkUserRole = (req, res, next) => {
    const token = req.cookies[config.token];
    if (!token) return res.status(403).send('Access denied');

    try {
        const decoded = jwt.verify(token, config.token);
        req.user = decoded;
        const userRole = req.user.user.role;

        let requiredRoles = ["User"]

        if(requiredRoles.includes(userRole)){
          console.log(userRole)
          return next();
        }

        return res.status(403).json({ message: 'Acceso no autorizado a este usuario' });

    } catch (error) {
        res.status(401).json({ error: { message: 'Invalid token'}});
    }
  };


