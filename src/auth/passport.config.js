import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import UserManager from '../dao/users.manager.js';
import dotenv from 'dotenv';

dotenv.config();
const userManager = new UserManager();

passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await userManager.getOne({ email });
        if (!user) return done(null, false, { message: 'Usuario no encontrado' });

        const isValid = await userManager.isValidPassword(password, user.password);
        if (!isValid) return done(null, false, { message: 'Contraseña incorrecta' });

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.use('jwt', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET
}, async (jwt_payload, done) => {
    try {
        const user = await userManager.getOne({ _id: jwt_payload.id });
        if (!user) return done(null, false);
        return done(null, user);
    } catch (err) {
        return done(err, false);
    }
}));

export default passport;
