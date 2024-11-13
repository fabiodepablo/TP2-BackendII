import express from 'express';
import UserManager from '../dao/users.manager.js';

const router = express.Router();
const userManager = new UserManager();

router.post('/register', async (req, res) => {
    try {
        const newUser = await userManager.add(req.body);
        res.json({ message: 'Usuario registrado con éxito', user: newUser });
    } catch (error) {
        res.status(400).json({ error: 'Error al registrar el usuario', details: error.message });
    }
});

export default router;
