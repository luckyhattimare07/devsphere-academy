// ============================================================
// routes/dashboard.ts
// ============================================================
import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { DashboardController } from '../controllers/dashboardController';

const router = Router();
const ctrl = new DashboardController();

router.get('/', authenticate, ctrl.getDashboard);
router.get('/heatmap', authenticate, ctrl.getHeatmap);
router.get('/bookmarks', authenticate, ctrl.getBookmarks);
router.get('/recent', authenticate, ctrl.getRecent);

export default router;
