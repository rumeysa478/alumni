/**
 * @file src/models/application.model.js
 * @description İş ve Staj Başvuruları Aksiyon Modeli (Application Action Model)
 * Users ve JobPostings arasındaki N:M ilişkiyi zengin aksiyon durumlarıyla yöneten model.
 * @author Rumeysa Aydın
 */

import pool from '../database/connection.js';

export const APPLICATION_STATUS = {
  PENDING: 'PENDING',
  REVIEWING: 'REVIEWING',
  INTERVIEW: 'INTERVIEW',
  OFFERED: 'OFFERED',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  WITHDRAWN: 'WITHDRAWN'
};

export const VALID_STATUSES = Object.values(APPLICATION_STATUS);

class ApplicationModel {
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
        cover_letter: 'Bilgisayar Mühendisliği 3. sınıf öğrencisiyim. Staj programınıza katılmayı ve web teknolojilerinde kendimi geliştirmeyi çok istiyorum.',
        resume_url: '/uploads/resumes/ahmet_yilmaz_cv.pdf',
        portfolio_url: 'https://github.com/ahmetyilmaz',
        expected_salary: 20000.00,
        status: APPLICATION_STATUS.PENDING,
        notes: 'Ön elemeden geçti, teknik mülakat planlanabilir.',
        rejection_reason: null
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
      portfolio_url: row.portfolio_url || null,
      expected_salary: row.expected_salary !== null && row.expected_salary !== undefined ? parseFloat(row.expected_salary) : null,
      status: row.status || APPLICATION_STATUS.PENDING,
      notes: row.notes || null,
      rejection_reason: row.rejection_reason || null,
      applied_at: row.applied_at ? new Date(row.applied_at).toISOString() : new Date().toISOString(),
      updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
    };
  }

  normalizeStatus(status) {
    if (!status) return APPLICATION_STATUS.PENDING;
    const upper = String(status).toUpperCase().trim();
    if (upper === 'REVIEWED') return APPLICATION_STATUS.REVIEWING;
    return upper;
  }

  async getAll(filters = {}) {
    try {
      let queryText = 'SELECT * FROM applications WHERE 1=1';
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
        const normStatus = this.normalizeStatus(filters.status);
        params.push(normStatus);
        queryText += ` AND status = $${params.length}`;
      }

      queryText += ' ORDER BY applied_at DESC';

      const res = await pool.query(queryText, params);
      return res.rows.map(r => this.formatFromDb(r));
    } catch {
      // applications tablosu yoksa veya veritabanı offline ise in-memory'den dön
      return this.getAllInMemory(filters);
    }
  }

  async getById(id) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;

    try {
      const res = await pool.query('SELECT * FROM applications WHERE id = $1', [numericId]);
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
        'SELECT * FROM applications WHERE job_id = $1 AND user_id = $2',
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
    const {
      job_id,
      user_id,
      cover_letter = '',
      resume_url = '',
      portfolio_url = null,
      expected_salary = null,
      notes = null
    } = data;

    const numJobId = parseInt(job_id, 10);
    const numUserId = parseInt(user_id, 10);

    if (isNaN(numJobId) || isNaN(numUserId)) {
      throw new Error('job_id ve user_id zorunludur.');
    }

    let parsedSalary = null;
    if (expected_salary !== null && expected_salary !== undefined && expected_salary !== '') {
      parsedSalary = parseFloat(expected_salary);
      if (isNaN(parsedSalary) || parsedSalary < 0) {
        throw new Error('Beklenen maaş negatif veya geçersiz bir sayı olamaz.');
      }
    }

    try {
      const res = await pool.query(
        `INSERT INTO applications (job_id, user_id, cover_letter, resume_url, portfolio_url, expected_salary, status, notes)
         VALUES ($1, $2, $3, $4, $5, $6, 'PENDING', $7)
         RETURNING *`,
        [numJobId, numUserId, cover_letter, resume_url, portfolio_url, parsedSalary, notes]
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
        portfolio_url,
        expected_salary: parsedSalary,
        status: APPLICATION_STATUS.PENDING,
        notes
      });
    }
  }

  async update(id, data = {}) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;

    const existing = await this.getById(numericId);
    if (!existing) return null;

    const cover_letter = data.cover_letter !== undefined ? data.cover_letter : existing.cover_letter;
    const resume_url = data.resume_url !== undefined ? data.resume_url : existing.resume_url;
    const portfolio_url = data.portfolio_url !== undefined ? data.portfolio_url : existing.portfolio_url;
    let expected_salary = existing.expected_salary;

    if (data.expected_salary !== undefined) {
      if (data.expected_salary === null || data.expected_salary === '') {
        expected_salary = null;
      } else {
        expected_salary = parseFloat(data.expected_salary);
        if (isNaN(expected_salary) || expected_salary < 0) {
          throw new Error('Beklenen maaş negatif olamaz.');
        }
      }
    }

    let status = existing.status;
    if (data.status !== undefined) {
      status = this.normalizeStatus(data.status);
      if (!VALID_STATUSES.includes(status)) {
        throw new Error(`Geçersiz başvuru durumu: ${data.status}. Kabul edilenler: ${VALID_STATUSES.join(', ')}`);
      }
    }

    const notes = data.notes !== undefined ? data.notes : existing.notes;
    const rejection_reason = data.rejection_reason !== undefined ? data.rejection_reason : existing.rejection_reason;

    try {
      const res = await pool.query(
        `UPDATE applications 
         SET cover_letter = $1, resume_url = $2, portfolio_url = $3, expected_salary = $4, status = $5, notes = $6, rejection_reason = $7, updated_at = CURRENT_TIMESTAMP
         WHERE id = $8
         RETURNING *`,
        [cover_letter, resume_url, portfolio_url, expected_salary, status, notes, rejection_reason, numericId]
      );
      if (res.rows.length === 0) return null;
      return this.formatFromDb(res.rows[0]);
    } catch {
      const index = this.inMemoryApplications.findIndex(a => a.id === numericId);
      if (index === -1) return null;

      this.inMemoryApplications[index] = {
        ...this.inMemoryApplications[index],
        cover_letter,
        resume_url,
        portfolio_url,
        expected_salary,
        status,
        notes,
        rejection_reason,
        updated_at: new Date().toISOString()
      };

      return { ...this.inMemoryApplications[index] };
    }
  }

  async updateStatus(id, status, notes = null, rejection_reason = null) {
    const numericId = parseInt(id, 10);
    const normStatus = this.normalizeStatus(status);

    if (!VALID_STATUSES.includes(normStatus)) {
      throw new Error(`Geçersiz başvuru durumu. Kabul edilenler: ${VALID_STATUSES.join(', ')}`);
    }

    try {
      const res = await pool.query(
        `UPDATE applications 
         SET status = $1, 
             notes = COALESCE($2, notes), 
             rejection_reason = COALESCE($3, rejection_reason), 
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = $4 
         RETURNING *`,
        [normStatus, notes, rejection_reason, numericId]
      );
      if (res.rows.length === 0) return null;
      return this.formatFromDb(res.rows[0]);
    } catch {
      const app = this.inMemoryApplications.find(a => a.id === numericId);
      if (!app) return null;
      app.status = normStatus;
      if (notes !== null) app.notes = notes;
      if (rejection_reason !== null) app.rejection_reason = rejection_reason;
      app.updated_at = new Date().toISOString();
      return { ...app };
    }
  }

  async withdraw(id, userId = null) {
    const numericId = parseInt(id, 10);
    const existing = await this.getById(numericId);
    if (!existing) return null;

    if (userId !== null && existing.user_id !== parseInt(userId, 10)) {
      const err = new Error('Yalnızca kendi başvurunuzu geri çekebilirsiniz.');
      err.code = 403;
      throw err;
    }

    return this.updateStatus(numericId, APPLICATION_STATUS.WITHDRAWN, 'Aday tarafından geri çekildi.');
  }

  async delete(id) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;

    try {
      const res = await pool.query('DELETE FROM applications WHERE id = $1 RETURNING *', [numericId]);
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
      const status = this.normalizeStatus(filters.status);
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

    let parsedSalary = null;
    if (data.expected_salary !== null && data.expected_salary !== undefined && data.expected_salary !== '') {
      parsedSalary = parseFloat(data.expected_salary);
    }

    const newApp = {
      id: this.nextId++,
      job_id: numJobId,
      user_id: numUserId,
      cover_letter: data.cover_letter || '',
      resume_url: data.resume_url || '',
      portfolio_url: data.portfolio_url || null,
      expected_salary: parsedSalary,
      status: data.status || APPLICATION_STATUS.PENDING,
      notes: data.notes || null,
      rejection_reason: data.rejection_reason || null,
      applied_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
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

export const applicationModel = new ApplicationModel();
export default applicationModel;
