//Middlewares for app.js
//Express + handlebars
import express from "express";
import session from 'express-session';
import handlebars from "express-handlebars";
//Cookie parser
import cookieParser from "cookie-parser";
//Dirname
import __dirname from "../dirname.js";
//DB
import MongoStore from 'connect-mongo';
import config from './config.js';
//Passport
import passport from 'passport';
import initializePassport from '../config/passport.config.js';
import initializePassportJWT from '../config/jwt.config.js';
//Cors
import cors from "cors";
//Logger
import { loggerMiddleware } from "../utils/logger-env.js";
//Swagger
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

//Swagger config
const swaggerOptions = {
    definition: {
      openapi: "3.0.1",
      info: {
        title: "API - Proyecto E-commerce",
        version: "1.0.0",
        description: "Documentacion de la API del Curso de Backend",
      },
    },
    apis: [`${__dirname}/docs/**/*.yaml`],
  };
const specs = swaggerJsdoc(swaggerOptions);

const middlewares = async (app) => {
    //Swagger
    app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(
        specs, 
        { customCss: ".swagger-ui .topbar {display: none}"}
        ));

    //Express
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));
    app.use(express.static(__dirname+'/public'));

    //Cookie parser
    app.use(cookieParser());
    //Cors
    app.use(cors());
    //Logger
    app.use(loggerMiddleware);

    //DB
    app.use(session({
        store: new MongoStore({
            mongoUrl: config.mongo_url,
            ttl: 5
        }),
        secret:"secret",
        resave: false,
        saveUninitialized: false
    }));

    //Views folder
    app.set('views', `${__dirname}/views`);

    //Views engine (Motor de plantillas)
    app.set('view engine', 'handlebars');
    app.engine('handlebars', handlebars.engine({
      runtimeOptions: {
          allowProtoPropertiesByDefault: true,
          allowProtoMethodsByDefault: true
      },
      helpers: {
          eq: function (a, b) {
              return a === b;
          }
      }
  }));

    //Passport
    initializePassport()
    initializePassportJWT()
    app.use(passport.initialize())
    app.use(passport.session())
};
export default middlewares;
