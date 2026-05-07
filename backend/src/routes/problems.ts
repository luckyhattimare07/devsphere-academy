import { Router } from 'express';
import { query as dbQuery } from 'express-validator';
import { ProblemController } from '../controllers/problemController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';

const router = Router();
const ctrl = new ProblemController();

// GET /api/v1/problems — List all problems (with filters)
router.get(
  '/',
  [
    dbQuery('page').optional().isInt({ min: 1 }),
    dbQuery('limit').optional().isInt({ min: 1, max: 100 }),
    dbQuery('difficulty').optional().isIn(['Easy', 'Medium', 'Hard']),
    dbQuery('tag').optional().isString(),
    dbQuery('category').optional().isString(),
    dbQuery('search').optional().isString().isLength({ max: 100 }),
    dbQuery('status').optional().isIn(['solved', 'unsolved', 'attempted']),
  ],
  validate,
  ctrl.listProblems
);

// GET /api/v1/problems/random — Get a random problem
router.get('/random', ctrl.randomProblem);

// GET /api/v1/problems/tags — All tags
router.get('/tags', ctrl.getTags);

// GET /api/v1/problems/:slug — Single problem
router.get('/:slug', ctrl.getProblem);

// POST /api/v1/problems — Create problem (admin only)
router.post('/', authenticate, authorize('admin'), ctrl.createProblem);

// PUT /api/v1/problems/:id — Update problem
router.put('/:id', authenticate, authorize('admin'), ctrl.updateProblem);

// DELETE /api/v1/problems/:id — Delete problem
router.delete('/:id', authenticate, authorize('admin'), ctrl.deleteProblem);

// POST /api/v1/problems/:id/bookmark
router.post('/:id/bookmark', authenticate, ctrl.toggleBookmark);

// GET /api/v1/problems/:id/similar
router.get('/:id/similar', ctrl.getSimilarProblems);

export default router;
