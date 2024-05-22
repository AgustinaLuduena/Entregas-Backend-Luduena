export function auth (req, res, next) {
    if (!req.session || !req.session.user) {
      return res.redirect("/login");
    }
    next();
  }

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