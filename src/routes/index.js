import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import healthRoutes from './health.routes.js';
import apiUserRoutes from './apiUser.routes.js';
import userRoutes from './user.routes.js';
import apiAnnouncementRoutes from './apiAnnouncement.routes.js';
import announcementRoutes from './announcement.routes.js';
import { swaggerDocument } from '../config/swagger.js';

const apiRouter = Router();

// Swagger JSON Spec Endpoint
apiRouter.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(swaggerDocument);
});

// Swagger UI Endpoint at /api/swagger
const swaggerUiOptions = {
  customSiteTitle: 'Alumni API - Swagger Documentation'
};
apiRouter.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerUiOptions));

// Mount health routes at /api/health
apiRouter.use('/health', healthRoutes);

// Mount API user routes at /api/users
apiRouter.use('/users', apiUserRoutes);

// Mount API announcement routes at /api/announcements
apiRouter.use('/announcements', apiAnnouncementRoutes);

export { apiRouter, userRoutes, apiUserRoutes, announcementRoutes, apiAnnouncementRoutes };
export default apiRouter;
