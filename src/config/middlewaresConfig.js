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
//Passport
import passport from 'passport';
import initializePassport from '../config/passport.config.js';

// //Este código duplicado en "config" va a ser reemplazado por Varialbles de Entorno luego
const PASS_MONGO = "mongodb2024"
const DB_URL = `mongodb+srv://agusluduena4:${PASS_MONGO}@cluster0.egyfnzt.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0`

const middlewares = async (app) => {
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));
    app.use(express.static(__dirname+'/public'));
    //Cookie parser
    app.use(cookieParser())
    //DB
    app.use(session({
        store: new MongoStore({
            mongoUrl: DB_URL,
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




