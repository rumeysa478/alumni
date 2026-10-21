/**
 * @file src/routes/index.js
 * @description Merkezi API Router Kaydı (/api)
 * @author Rumeysa Aydın
 */

import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import healthRoutes from './health.routes.js';
import apiUserRoutes from './apiUser.routes.js';
import userRoutes from './user.routes.js';
import apiAnnouncementRoutes from './apiAnnouncement.routes.js';
import announcementRoutes from './announcement.routes.js';
import apiJobRoutes from './apiJob.routes.js';
import jobRoutes from './job.routes.js';
import apiApplicationRoutes from './apiApplication.routes.js';
import applicationRoutes from './application.routes.js';
import apiEventRoutes from './apiEvent.routes.js';
import eventRoutes from './event.routes.js';
import apiProfileRoutes from './apiProfile.routes.js';
import apiMentorshipRoutes from './apiMentorship.routes.js';
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

// 1. Health check routes (/api/health)
apiRouter.use('/health', healthRoutes);

// 2. Users REST API routes (/api/users)
apiRouter.use('/users', apiUserRoutes);

// 3. Announcements REST API routes (/api/announcements)
apiRouter.use('/announcements', apiAnnouncementRoutes);

// 4. Job Postings REST API routes (/api/jobs)
apiRouter.use('/jobs', apiJobRoutes);

// 5. Applications REST API routes (/api/applications)
apiRouter.use('/applications', apiApplicationRoutes);

// 6. Events & Attendees REST API routes (/api/events)
apiRouter.use('/events', apiEventRoutes);

// 7. Alumni Profiles REST API routes (/api/profiles)
apiRouter.use('/profiles', apiProfileRoutes);

// 8. Mentorships REST API routes (/api/mentorships)
apiRouter.use('/mentorships', apiMentorshipRoutes);

export {
  apiRouter,
  userRoutes,
  apiUserRoutes,
  announcementRoutes,
  apiAnnouncementRoutes,
  jobRoutes,
  apiJobRoutes,
  applicationRoutes,
  apiApplicationRoutes,
  eventRoutes,
  apiEventRoutes,
  apiProfileRoutes,
  apiMentorshipRoutes
};

export default apiRouter;
