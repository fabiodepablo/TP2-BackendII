import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import './auth/passport.config.js';
import usersRouter from './routes/users.router.js';
import sessionsRouter from './routes/sessions.router.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.SECRET));
app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rutas de la aplicación
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);
app.get('/register', (req, res) => res.render('register'));
app.get('/login', (req, res) => res.render('login'));
app.use(express.static(path.join(__dirname, '../public')));

// Conectar a MongoDB y levantar el servidor
const startServer = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
};

startServer();
