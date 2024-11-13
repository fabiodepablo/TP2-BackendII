import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/login', passport.authenticate('login', { session: false }), (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Autenticación fallida' });
    }
    const token = jwt.sign({ id: req.user._id }, process.env.SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true }).json({ message: 'Login exitoso', token });
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user);
});

export default router;
