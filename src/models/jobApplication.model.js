/**
 * @file src/models/jobApplication.model.js
 * @description İş Başvurusu Modeli (JobApplication Model) - N:M Bridge between Users and JobPostings
 * @author Rumeysa Aydın
 */

import pool from '../database/connection.js';

const VALID_STATUSES = ['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED'];

class JobApplicationModel {
  constructor() {
    this.inMemoryApplications = [];
    this.nextId = 1;
    this.seedInitialData();
  }

  seedInitialData() {
    const seedData = [
      {
        job_id: 2,
        user_id: 2,
        cover_letter: 'Bilgisayar Mühendisliği 3. sınıf öğrencisiyim. Şirketiniz bünyesinde stajyer yazılım geliştirici olarak deneyim kazanmak istiyorum.',
        resume_url: '/uploads/resumes/ahmet_yilmaz_cv.pdf',
        status: 'PENDING'
      }
    ];

    seedData.forEach(app => this.createInMemory(app));
  }

  formatFromDb(row) {
    if (!row) return null;
    return {
      id: row.id,
      job_id: row.job_id,
      user_id: row.user_id,
      cover_letter: row.cover_letter || '',
      resume_url: row.resume_url || '',
      status: row.status || 'PENDING',
      applied_at: row.applied_at ? new Date(row.applied_at).toISOString() : new Date().toISOString()
    };
  }

  async getAll(filters = {}) {
    try {
      let queryText = 'SELECT * FROM job_applications WHERE 1=1';
      const params = [];

      if (filters.job_id) {
        params.push(parseInt(filters.job_id, 10));
        queryText += ` AND job_id = $${params.length}`;
      }

      if (filters.user_id) {
        params.push(parseInt(filters.user_id, 10));
        queryText += ` AND user_id = $${params.length}`;
      }

      if (filters.status) {
        params.push(String(filters.status).toUpperCase().trim());
        queryText += ` AND status = $${params.length}`;
      }

      queryText += ' ORDER BY applied_at DESC';

      const res = await pool.query(queryText, params);
      return res.rows.map(r => this.formatFromDb(r));
    } catch {
      return this.getAllInMemory(filters);
    }
  }

  async getById(id) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;

    try {
      const res = await pool.query('SELECT * FROM job_applications WHERE id = $1', [numericId]);
      if (res.rows.length === 0) return null;
      return this.formatFromDb(res.rows[0]);
    } catch {
      const app = this.inMemoryApplications.find(a => a.id === numericId);
      return app ? { ...app } : null;
    }
  }

  async getByJobId(jobId) {
    return this.getAll({ job_id: jobId });
  }

  async getByUserId(userId) {
    return this.getAll({ user_id: userId });
  }

  async getByJobAndUser(jobId, userId) {
    const numJobId = parseInt(jobId, 10);
    const numUserId = parseInt(userId, 10);

    try {
      const res = await pool.query(
        'SELECT * FROM job_applications WHERE job_id = $1 AND user_id = $2',
        [numJobId, numUserId]
      );
      if (res.rows.length === 0) return null;
      return this.formatFromDb(res.rows[0]);
    } catch {
      const app = this.inMemoryApplications.find(a => a.job_id === numJobId && a.user_id === numUserId);
      return app ? { ...app } : null;
    }
  }

  async apply(data) {
    const { job_id, user_id, cover_letter = '', resume_url = '' } = data;
    const numJobId = parseInt(job_id, 10);
    const numUserId = parseInt(user_id, 10);

    if (isNaN(numJobId) || isNaN(numUserId)) {
      throw new Error('job_id ve user_id zorunludur.');
    }

    try {
      const res = await pool.query(
        `INSERT INTO job_applications (job_id, user_id, cover_letter, resume_url, status)
         VALUES ($1, $2, $3, $4, 'PENDING')
         RETURNING *`,
        [numJobId, numUserId, cover_letter, resume_url]
      );
      return this.formatFromDb(res.rows[0]);
    } catch (err) {
      if (err.code === '23505') {
        const error = new Error('Bu ilana zaten başvuruda bulundunuz.');
        error.code = 409;
        throw error;
      }
      return this.createInMemory({
        job_id: numJobId,
        user_id: numUserId,
        cover_letter,
        resume_url,
        status: 'PENDING'
      });
    }
  }

  async updateStatus(id, status) {
    const numericId = parseInt(id, 10);
    const upperStatus = String(status).toUpperCase().trim();

    if (!VALID_STATUSES.includes(upperStatus)) {
      throw new Error(`Geçersiz başvuru durumu. Kabul edilenler: ${VALID_STATUSES.join(', ')}`);
    }

    try {
      const res = await pool.query(
        'UPDATE job_applications SET status = $1 WHERE id = $2 RETURNING *',
        [upperStatus, numericId]
      );
      if (res.rows.length === 0) return null;
      return this.formatFromDb(res.rows[0]);
    } catch {
      const app = this.inMemoryApplications.find(a => a.id === numericId);
      if (!app) return null;
      app.status = upperStatus;
      return { ...app };
    }
  }

  async delete(id) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;

    try {
      const res = await pool.query('DELETE FROM job_applications WHERE id = $1 RETURNING *', [numericId]);
      if (res.rows.length === 0) return null;
      return this.formatFromDb(res.rows[0]);
    } catch {
      const index = this.inMemoryApplications.findIndex(a => a.id === numericId);
      if (index === -1) return null;
      const [deleted] = this.inMemoryApplications.splice(index, 1);
      return deleted;
    }
  }

  getAllInMemory(filters = {}) {
    let result = [...this.inMemoryApplications];

    if (filters.job_id) {
      const jobId = parseInt(filters.job_id, 10);
      result = result.filter(a => a.job_id === jobId);
    }

    if (filters.user_id) {
      const userId = parseInt(filters.user_id, 10);
      result = result.filter(a => a.user_id === userId);
    }

    if (filters.status) {
      const status = String(filters.status).toUpperCase().trim();
      result = result.filter(a => a.status === status);
    }

    return result.sort((a, b) => new Date(b.applied_at) - new Date(a.applied_at)).map(a => ({ ...a }));
  }

  createInMemory(data) {
    const numJobId = parseInt(data.job_id, 10);
    const numUserId = parseInt(data.user_id, 10);

    const existing = this.inMemoryApplications.find(a => a.job_id === numJobId && a.user_id === numUserId);
    if (existing) {
      const error = new Error('Bu ilana zaten başvuruda bulundunuz.');
      error.code = 409;
      throw error;
    }

    const newApp = {
      id: this.nextId++,
      job_id: numJobId,
      user_id: numUserId,
      cover_letter: data.cover_letter || '',
      resume_url: data.resume_url || '',
      status: data.status || 'PENDING',
      applied_at: new Date().toISOString()
    };

    this.inMemoryApplications.push(newApp);
    return { ...newApp };
  }

  reset() {
    this.inMemoryApplications = [];
    this.nextId = 1;
    this.seedInitialData();
  }
}

export const jobApplicationModel = new JobApplicationModel();
export default jobApplicationModel;
