import { Router } from 'express';
import { uploader } from '../libs/storage';
import { allowAccess } from '../middlewares/acl-middleware';
import { mustAuthMiddleware } from '../middlewares/auth-middleware';
import { validatorMiddleware } from '../middlewares/validator-middleware';
import {
  createReportProgressService,
  createReportService,
  deleteReportService,
  getReportService,
  listReportsByReporterService,
  listReportsService,
  toggleReportStatusService,
  updateReportService,
} from '../services/report-service';
import { generateFileValidator } from '../validators/common-validator';
import {
  createReportProgressValidator,
  createReportValidator,
  listReportsQueryValidator,
  updateReportValidator,
} from '../validators/report-validator';

const router: Router = Router();

router.post(
  '/',
  mustAuthMiddleware,
  allowAccess('user'),
  uploader('reports', generateFileValidator(['image/jpeg', 'image/png', 'image/jpg'], 5)).fields([
    { name: 'photos', maxCount: 5 },
  ]),
  validatorMiddleware({ body: createReportValidator }),
  async (req, res) => {
    const response = await createReportService(req.validated.body, req.user.id);
    return response.finalize(res);
  }
);

router.get(
  '/',
  mustAuthMiddleware,
  validatorMiddleware({ query: listReportsQueryValidator }),
  async (req, res) => {
    const page = (req.validated.query?.page as number) || 1;
    const limit = (req.validated.query?.limit as number) || 10;
    const response = await listReportsService(page, limit);
    return response.finalize(res);
  }
);

router.get(
  '/me',
  mustAuthMiddleware,
  allowAccess('user'),
  validatorMiddleware({ query: listReportsQueryValidator }),
  async (req, res) => {
    const page = (req.validated.query?.page as number) || 1;
    const limit = (req.validated.query?.limit as number) || 10;
    const response = await listReportsByReporterService(req.user.id, page, limit);
    return response.finalize(res);
  }
);

router.get('/:id', mustAuthMiddleware, async (req, res) => {
  const response = await getReportService(req.params.id, req.user.id);
  return response.finalize(res);
});

router.put(
  '/:id',
  mustAuthMiddleware,
  allowAccess('user'),
  validatorMiddleware({ body: updateReportValidator }),
  async (req, res) => {
    const response = await updateReportService(req.params.id, req.validated.body, req.user.id);
    return response.finalize(res);
  }
);

router.delete('/:id', mustAuthMiddleware, allowAccess('admin'), async (req, res) => {
  const response = await deleteReportService(req.params.id);
  return response.finalize(res);
});

router.patch('/:id/toggle-status', mustAuthMiddleware, allowAccess('admin'), async (req, res) => {
  const response = await toggleReportStatusService(req.params.id);
  return response.finalize(res);
});

router.post(
  '/:id/progress',
  mustAuthMiddleware,
  allowAccess('admin'),
  uploader('progresses', generateFileValidator(['image/jpeg', 'image/png', 'image/jpg'], 5)).fields(
    [{ name: 'photos', maxCount: 5 }]
  ),
  validatorMiddleware({ body: createReportProgressValidator }),
  async (req, res) => {
    const response = await createReportProgressService(req.params.id, req.validated.body);
    return response.finalize(res);
  }
);

export default router;
