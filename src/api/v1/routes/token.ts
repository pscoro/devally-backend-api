import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import controller from '../controllers/token';

const router = express.Router();

router.options('/refresh', cors());
router.get('/refresh', controller.refreshToken);

export default router;
