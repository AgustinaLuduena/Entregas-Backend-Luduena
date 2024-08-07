import passport from "passport";
import local from "passport-local";
//Models
import userModel from "../dao/models/users.js";
//Utils
import { createHash, isValidPassword } from "../utils/utils.js";
//Logger
import logger from "../utils/logger-env.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  //Local strategy to register
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
          const user = await userModel.findOne({ email: username });
          if (user) {
            logger.warning("This user already exist in the data base.");
            return done(null, false); 
          }

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };

          //NewUser to the DB
          const result = await userModel.create(newUser);
          return done (null, result);
        } catch (error) {
          return done (error);
        }
      }
    )
  );

  //Local strategy to log in
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          if (username === "adminCoder@coder.com" && password === "adminCod3r123") {
            //CoderHouse Admin´s validation. Gets in and it is not save in the DB.
            const admin = {
              email: "adminCoder@coder.com",
              first_name: "Administrador",
              last_name: "Coderhouse",
              role: "admin",
              age: "No disponible",
              cart: "El admin no tiene un carrito asignado"
            };
            let user = admin;
            return done(null, user);
          }
          
          const user = await userModel.findOne({ email: username });
          if (!user) return done(null, false);
  
          const valid = isValidPassword(user, password);
          if (!valid) return done(null, false);
          
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  


  //Serializer and deserializer user
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await userModel.findById(id);
      done (null, user);
    } catch (error) {
      done (error);
    }
  });
};


export default initializePassport;