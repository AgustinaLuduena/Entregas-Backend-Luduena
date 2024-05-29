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

// Middleware de autenticación USER / ADMIN

// export const authenticate = async (req, res, next) => {
//   let token = null;
//   if (req && req.cookies) {
//     token = req.cookies[config.token];
//     console.log(token)
//   }
//   console.log(token)

//   if (!token) return res.status(401).send('Acceso denegado: No se proporcionó el token');

//   try {
//     const verified = jwt.verify(token, config.token);
//     const user = await userModel.findById(verified.id);
//     if (user) {
//       req.user = user;
//       next();
//     } else if (user.role === "admin") {
//       return res.json(req.user)
//     } else {
//       return res.status(404).send('Usuario no encontrado')
//     }

    
//   } catch (error) {
//     res.status(400).send('Token no válido');
//   }
// };

export const verifyToken = (req, res, next) => {
    const token = req.cookies.proyecto_backend;
    if (!token) return res.status(403).send('Access denied');

    try {
        const decoded = jwt.verify(token, config.token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).send('Invalid token');
    }
};


// export const checkUserRole = async(req, res, next) => {
//     let token = null;
//     if (req && req.cookies) {
//       token = req.cookies[config.token];
//     }
//     if (!token) return res.status(401).send('Acceso denegado: No se proporcionó el token (Role)');

//     try {
//       const decodedToken = jwt.verify(token, config.token);
//       const userRole = decodedToken.role;

//       if (userRole) {
//         req.user = decodedToken._id;
//         return next();
//       } else {
//         return res.status(401).send('Acceso denegado: Role error');
//       }

//     } catch (err) {
//       return res.status(401).json({ error: { message: "Unauthorized" } });
//     }
// }

// Middleware de autenticación para admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
      return next();
  } else {
      return res.status(403).json({ message: 'Acceso no autorizado' });
  }
};

// Middleware de autenticación para user
export const isUser = (req, res, next) => {
  if(req.user && req.user.role === 'user') {
      next();
  } 
  else {
      return res.status(403).json({ error: 'Acceso no autorizado' });
  }
}
