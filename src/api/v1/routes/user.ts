import express from 'express';

import controller from '../controllers/user';
import extractJWT from '../middlewares/extractJWT';

const router = express.Router();

router.get('/validate', extractJWT, controller.validateToken); // i dont think i need this for anything
router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/get/all', controller.getAllUsers); // test route, add dev auth

export default router;
