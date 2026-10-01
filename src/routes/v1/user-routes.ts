import express from 'express';
import { UserController } from '../../controllers';

const router = express.Router();

router.post('/register', UserController.createUser);

router.post('/login', UserController.loginUser);

router.post('/logout', UserController.logoutUser);

router.post('/refresh', UserController.refreshUserAuth);

export default router;
