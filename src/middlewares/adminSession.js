export function admin (req, res, next) {
  if (username === "adminCoder@coder.com" && password === "adminCod3r123") {
    const user = {
      email: "adminCoder@coder.com",
      name: "Administrador",
      age: "Información no disponible",
      role: "admin" // Establecemos el rol como "admin" para el administrador
    };
    console.log(user)
    return done(null, user);
  }
  }

