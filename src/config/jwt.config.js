import passport from "passport";
import jwt from "passport-jwt";
import config from "./config.js";

const JWTStrategy = jwt.Strategy;
const ExtracJWT = jwt.ExtractJwt;

const initializePassportJWT = () => {

  //cookie starctor function
  const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies[config.token];
    }
    return token;
  };

  //jwt startegy
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtracJWT.fromExtractors([cookieExtractor]),
        secretOrKey: config.token,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
export default initializePassportJWT;