import { Router } from 'express';
import { body } from 'express-validator';
import { CompilerController } from '../controllers/compilerController';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';

const router = Router();
const ctrl = new CompilerController();

router.post(
  '/execute',
  [
    body('language').isIn(['c', 'cpp', 'java', 'python', 'javascript', 'typescript', 'go', 'rust']),
    body('source_code').notEmpty().isLength({ max: 65536 }),
    body('stdin').optional().isString().isLength({ max: 65536 }),
  ],
  validate,
  ctrl.execute
);

router.get('/status/:token', ctrl.getStatus);
router.get('/languages', ctrl.getSupportedLanguages);

export default router;