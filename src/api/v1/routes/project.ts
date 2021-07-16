import express from 'express';

import controller from '../controllers/project';
import extractJWT from '../middlewares/extractJWT';

const router = express.Router();

router.post('/create', extractJWT, controller.createProject); // i dont think i need this for anything
router.delete('/delete', extractJWT, controller.deleteProject);
router.get('/get/:projectId', controller.getProjectById);

export default router;
