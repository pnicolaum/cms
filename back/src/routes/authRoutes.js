import express from 'express';
import { register, login, me } from '../controllers/authController.js';
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", protectRoute, me);
router.post('/register', register);
router.post('/login', login);

export default router;
