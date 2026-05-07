import { Router } from 'express';
import { body } from 'express-validator';
import { SubmissionController } from '../controllers/submissionController';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';

const router = Router();
const ctrl = new SubmissionController();

// POST /submissions — Submit a solution
router.post(
  '/',
  authenticate,
  [
    body('problem_id').isUUID(),
    body('language').isIn(['c', 'cpp', 'java', 'python', 'javascript', 'typescript', 'go', 'rust']),
    body('code').notEmpty().isLength({ max: 65536 }),
  ],
  validate,
  ctrl.submit
);

// GET /submissions/me — My submissions
router.get('/me', authenticate, ctrl.mySubmissions);

// GET /submissions/:id — Single submission
router.get('/:id', authenticate, ctrl.getSubmission);

// GET /submissions/problem/:problemId — All submissions for a problem (admin)
router.get('/problem/:problemId', authenticate, ctrl.problemSubmissions);

export default router;
