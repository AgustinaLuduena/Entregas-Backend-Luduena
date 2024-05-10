//Middlewares for app.js
//Express + handlebars
import express from "express";
import session from 'express-session';
import handlebars from "express-handlebars";
//Cookie parser
import cookieParser from "cookie-parser";
//Utils
import __dirname from "../utils.js";
//DB
import MongoStore from 'connect-mongo';
import config from './config.js';
//Passport
import passport from 'passport';
import initializePassport from '../config/passport.config.js';


const middlewares = async (app) => {
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));
    app.use(express.static(__dirname+'/public'));
    //Cookie parser
    app.use(cookieParser())
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
    //Carpeta de vistas
    app.set('views', `${__dirname}/views`);

    //Motor de plantillas
    app.set('view engine', 'handlebars');
    app.engine('handlebars', handlebars.engine());

    //Passport
    initializePassport()
    app.use(passport.initialize())
    app.use(passport.session())
};
export default middlewares;




