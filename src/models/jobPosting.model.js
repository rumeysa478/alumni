/**
 * @file src/models/jobPosting.model.js
 * @description İş ve Staj İlanı Modeli (JobPosting Model)
 * @author Rumeysa Aydın
 */

import pool from '../database/connection.js';

const VALID_WORK_MODELS = ['ONSITE', 'HYBRID', 'REMOTE'];
const VALID_TYPES = ['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT', 'FREELANCE', 'REMOTE'];
const VALID_EXPERIENCE_LEVELS = ['INTERN', 'ENTRY_LEVEL', 'JUNIOR', 'MID', 'SENIOR', 'LEAD'];

class JobPostingModel {
  constructor() {
    this.inMemoryJobs = [];
    this.nextId = 1;
    this.seedInitialData();
  }

  seedInitialData() {
    const seedData = [
      {
        title: 'Junior Backend Developer',
        company: 'Tech Global Solutions',
        description: 'Node.js, Express ve PostgreSQL deneyimli çalışma arkadaşı aranıyor.',
        requirements: 'Node.js & Express temelleri, PostgreSQL/SQL bilgisi, REST API geliştirme tecrübesi, Git kullanımı.',
        location: 'İstanbul (Maslak)',
        work_model: 'HYBRID',
        type: 'FULL_TIME',
        experience_level: 'JUNIOR',
        sector: 'Yazılım & Bilişim',
        salary_min: 45000,
        salary_max: 65000,
        currency: 'TRY',
        application_url: 'https://techglobal.com/careers/jr-backend',
        contact_email: 'kariyer@techglobal.com',
        deadline: '2026-12-31T23:59:59.000Z',
        posted_by: 1,
        is_active: true,
        view_count: 142
      },
      {
        title: 'Stajyer Yazılım Geliştirici',
        company: 'Cyber Security Corp',
        description: 'Web programlama temellerine hakim, öğrenmeye açık stajyer.',
        requirements: 'Üniversitelerin ilgili mühendislik/bilişim bölümlerinde 3. veya 4. sınıf öğrencisi olmak, temel JavaScript/Python bilgisi.',
        location: 'Ankara / Uzaktan',
        work_model: 'REMOTE',
        type: 'INTERNSHIP',
        experience_level: 'INTERN',
        sector: 'Siber Güvenlik',
        salary_min: 18500,
        salary_max: 22000,
        currency: 'TRY',
        application_url: 'https://cybercorp.io/internship-2026',
        contact_email: 'hr@cybercorp.io',
        deadline: '2026-11-30T23:59:59.000Z',
        posted_by: 3,
        is_active: true,
        view_count: 89
      },
      {
        title: 'Frontend Developer (React & TypeScript)',
        company: 'Trendyol Tech',
        description: 'Milyonlarca kullanıcıya hizmet veren e-ticaret platformumuzun web arayüzlerini geliştirecek, performans odaklı Frontend Mühendisi arıyoruz.',
        requirements: '• En az 2 yıl React & TypeScript tecrübesi\n• Modern CSS (Tailwind CSS, Styled Components)\n• State yönetimi (Redux Toolkit, Zustand)\n• Web Performans Optimizasyonu ve SEO standartları',
        location: 'İstanbul (Maslak)',
        work_model: 'HYBRID',
        type: 'FULL_TIME',
        experience_level: 'MID',
        sector: 'E-Ticaret & Yazılım',
        salary_min: 65000,
        salary_max: 90000,
        currency: 'TRY',
        application_url: 'https://careers.trendyol.com/frontend-dev',
        contact_email: 'tech-talent@trendyol.com',
        deadline: '2026-12-15T23:59:59.000Z',
        posted_by: 3,
        is_active: true,
        view_count: 310
      },
      {
        title: 'Yapay Zeka & Veri Bilimi Stajyeri',
        company: 'Insider Dynamics',
        description: 'Makine öğrenimi, büyük veri analitiği ve tavsiye motorları üzerinde çalışacak dinamik stajyerler aranıyor.',
        requirements: '• Üniversitelerin 3. veya 4. sınıf öğrencisi olmak\n• Python (NumPy, Pandas, Scikit-learn) yetkinliği\n• SQL veri analizi temelleri\n• Meraklı ve analitik bakış açısı',
        location: 'Uzaktan / Remote',
        work_model: 'REMOTE',
        type: 'INTERNSHIP',
        experience_level: 'INTERN',
        sector: 'Yapay Zeka & Büyük Veri',
        salary_min: 22000,
        salary_max: 26000,
        currency: 'TRY',
        application_url: 'https://useinsider.com/careers/ai-intern-2026',
        contact_email: 'campus@useinsider.com',
        deadline: '2026-11-20T23:59:59.000Z',
        posted_by: 3,
        is_active: true,
        view_count: 245
      },
      {
        title: 'DevOps & Bulut Altyapı Mühendisi',
        company: 'Havelsan',
        description: 'Savunma ve kamu projelerinde güvenli CI/CD boru hatları, Kubernetes küme yönetimi ve Linux sistem mimarisi sorumlusu.',
        requirements: '• Docker ve Kubernetes orkestrasyonu\n• CI/CD (GitLab CI, GitHub Actions, Jenkins)\n• Linux sunucu yönetimi ve Bash/Python betikleme\n• Ağ güvenliği ve izleme (Prometheus, Grafana)',
        location: 'Ankara (ODTÜ Teknokent)',
        work_model: 'ONSITE',
        type: 'FULL_TIME',
        experience_level: 'MID',
        sector: 'Savunma Sanayii & Bilişim',
        salary_min: 80000,
        salary_max: 115000,
        currency: 'TRY',
        application_url: 'https://kariyer.havelsan.com.tr/ilan/devops-muhendisi',
        contact_email: 'ik@havelsan.com.tr',
        deadline: '2027-01-15T23:59:59.000Z',
        posted_by: 3,
        is_active: true,
        view_count: 178
      },
      {
        title: 'Mobile Developer (Flutter / React Native)',
        company: 'Getir Tech',
        description: 'Hızlı teslimat ekosistemimizde iOS ve Android uygulamalarımızın geliştirilmesinde aktif rol alacak mobil yazılımcı.',
        requirements: '• Flutter veya React Native ile en az 1 yıl uygulama geliştirme\n• RESTful API ve WebSocket entegrasyonları\n• App Store ve Google Play yayınlama süreçleri\n• Temel Clean Architecture ve UI/UX duyarlılığı',
        location: 'İstanbul (Levent)',
        work_model: 'HYBRID',
        type: 'FULL_TIME',
        experience_level: 'JUNIOR',
        sector: 'E-Ticaret & Mobil',
        salary_min: 52000,
        salary_max: 72000,
        currency: 'TRY',
        application_url: 'https://getir.com/careers/mobile-dev',
        contact_email: 'mobile-jobs@getir.com',
        deadline: '2026-12-25T23:59:59.000Z',
        posted_by: 3,
        is_active: true,
        view_count: 195
      }
    ];

    seedData.forEach(j => this.createInMemory(j));
  }

  formatFromDb(row) {
    if (!row) return null;
    return {
      id: row.id,
      title: row.title,
      company: row.company,
      description: row.description,
      requirements: row.requirements || null,
      location: row.location || '',
      work_model: row.work_model || 'HYBRID',
      type: row.type || 'FULL_TIME',
      experience_level: row.experience_level || 'MID',
      sector: row.sector || null,
      salary_min: row.salary_min !== null && row.salary_min !== undefined ? parseFloat(row.salary_min) : null,
      salary_max: row.salary_max !== null && row.salary_max !== undefined ? parseFloat(row.salary_max) : null,
      currency: row.currency || 'TRY',
      application_url: row.application_url || null,
      contact_email: row.contact_email || null,
      deadline: row.deadline ? new Date(row.deadline).toISOString() : null,
      posted_by: row.posted_by ? parseInt(row.posted_by, 10) : null,
      is_active: Boolean(row.is_active),
      view_count: row.view_count ? parseInt(row.view_count, 10) : 0,
      created_at: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : null
    };
  }

  async getAll(filters = {}) {
    try {
      let queryText = 'SELECT * FROM job_postings WHERE 1=1';
      const params = [];

      if (filters.search) {
        params.push(`%${String(filters.search).toLowerCase().trim()}%`);
        queryText += ` AND (LOWER(title) LIKE $${params.length} OR LOWER(company) LIKE $${params.length} OR LOWER(description) LIKE $${params.length} OR LOWER(sector) LIKE $${params.length})`;
      }

      if (filters.type) {
        params.push(String(filters.type).toUpperCase().trim());
        queryText += ` AND type = $${params.length}`;
      }

      if (filters.work_model) {
        params.push(String(filters.work_model).toUpperCase().trim());
        queryText += ` AND work_model = $${params.length}`;
      }

      if (filters.experience_level) {
        params.push(String(filters.experience_level).toUpperCase().trim());
        queryText += ` AND experience_level = $${params.length}`;
      }

      if (filters.is_active !== undefined) {
        params.push(Boolean(filters.is_active));
        queryText += ` AND is_active = $${params.length}`;
      }

      queryText += ' ORDER BY id DESC';

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
      const res = await pool.query('SELECT * FROM job_postings WHERE id = $1', [numericId]);
      if (res.rows.length === 0) return null;
      return this.formatFromDb(res.rows[0]);
    } catch {
      const job = this.inMemoryJobs.find(j => j.id === numericId);
      return job ? { ...job } : null;
    }
  }

  async getByPostedBy(userId) {
    const numericUserId = parseInt(userId, 10);
    if (isNaN(numericUserId)) return [];

    try {
      const res = await pool.query('SELECT * FROM job_postings WHERE posted_by = $1 ORDER BY id DESC', [numericUserId]);
      return res.rows.map(r => this.formatFromDb(r));
    } catch {
      return this.inMemoryJobs.filter(j => j.posted_by === numericUserId).map(j => ({ ...j }));
    }
  }

  async create(data) {
    const {
      title,
      company,
      description,
      requirements = null,
      location = '',
      work_model = 'HYBRID',
      type = 'FULL_TIME',
      experience_level = 'MID',
      sector = null,
      salary_min = null,
      salary_max = null,
      currency = 'TRY',
      application_url = null,
      contact_email = null,
      deadline = null,
      posted_by = null,
      is_active = true
    } = data;

    if (!title || !company || !description) {
      throw new Error('title, company ve description alanları zorunludur.');
    }

    try {
      const res = await pool.query(
        `INSERT INTO job_postings (
          title, company, description, requirements, location, work_model,
          type, experience_level, sector, salary_min, salary_max,
          currency, application_url, contact_email, deadline, posted_by, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING *`,
        [
          title, company, description, requirements, location, work_model,
          type, experience_level, sector, salary_min, salary_max,
          currency, application_url, contact_email, deadline, posted_by, is_active
        ]
      );
      return this.formatFromDb(res.rows[0]);
    } catch {
      return this.createInMemory(data);
    }
  }

  async update(id, partialData) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;

    try {
      const existing = await this.getById(numericId);
      if (!existing) return null;

      const updated = {
        title: partialData.title !== undefined ? partialData.title : existing.title,
        company: partialData.company !== undefined ? partialData.company : existing.company,
        description: partialData.description !== undefined ? partialData.description : existing.description,
        requirements: partialData.requirements !== undefined ? partialData.requirements : existing.requirements,
        location: partialData.location !== undefined ? partialData.location : existing.location,
        work_model: partialData.work_model !== undefined ? partialData.work_model : existing.work_model,
        type: partialData.type !== undefined ? partialData.type : existing.type,
        experience_level: partialData.experience_level !== undefined ? partialData.experience_level : existing.experience_level,
        sector: partialData.sector !== undefined ? partialData.sector : existing.sector,
        salary_min: partialData.salary_min !== undefined ? partialData.salary_min : existing.salary_min,
        salary_max: partialData.salary_max !== undefined ? partialData.salary_max : existing.salary_max,
        currency: partialData.currency !== undefined ? partialData.currency : existing.currency,
        application_url: partialData.application_url !== undefined ? partialData.application_url : existing.application_url,
        contact_email: partialData.contact_email !== undefined ? partialData.contact_email : existing.contact_email,
        deadline: partialData.deadline !== undefined ? partialData.deadline : existing.deadline,
        is_active: partialData.is_active !== undefined ? partialData.is_active : existing.is_active
      };

      const res = await pool.query(
        `UPDATE job_postings SET
          title = $1, company = $2, description = $3, requirements = $4,
          location = $5, work_model = $6, type = $7, experience_level = $8,
          sector = $9, salary_min = $10, salary_max = $11, currency = $12,
          application_url = $13, contact_email = $14, deadline = $15,
          is_active = $16, updated_at = CURRENT_TIMESTAMP
        WHERE id = $17
        RETURNING *`,
        [
          updated.title, updated.company, updated.description, updated.requirements,
          updated.location, updated.work_model, updated.type, updated.experience_level,
          updated.sector, updated.salary_min, updated.salary_max, updated.currency,
          updated.application_url, updated.contact_email, updated.deadline,
          updated.is_active, numericId
        ]
      );
      return this.formatFromDb(res.rows[0]);
    } catch {
      return this.updateInMemory(numericId, partialData);
    }
  }

  async delete(id) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;

    try {
      const res = await pool.query('DELETE FROM job_postings WHERE id = $1 RETURNING *', [numericId]);
      if (res.rows.length === 0) return null;
      return this.formatFromDb(res.rows[0]);
    } catch {
      return this.deleteInMemory(numericId);
    }
  }

  async incrementViewCount(id) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;

    try {
      const res = await pool.query(
        'UPDATE job_postings SET view_count = view_count + 1 WHERE id = $1 RETURNING *',
        [numericId]
      );
      if (res.rows.length === 0) return null;
      return this.formatFromDb(res.rows[0]);
    } catch {
      const job = this.inMemoryJobs.find(j => j.id === numericId);
      if (!job) return null;
      job.view_count = (job.view_count || 0) + 1;
      return { ...job };
    }
  }

  getAllInMemory(filters = {}) {
    let result = [...this.inMemoryJobs];

    if (filters.search) {
      const term = String(filters.search).toLowerCase().trim();
      result = result.filter(j =>
        (j.title && j.title.toLowerCase().includes(term)) ||
        (j.company && j.company.toLowerCase().includes(term)) ||
        (j.description && j.description.toLowerCase().includes(term)) ||
        (j.sector && j.sector.toLowerCase().includes(term))
      );
    }

    if (filters.type) {
      const type = String(filters.type).toUpperCase().trim();
      result = result.filter(j => j.type === type);
    }

    if (filters.work_model) {
      const wm = String(filters.work_model).toUpperCase().trim();
      result = result.filter(j => j.work_model === wm);
    }

    if (filters.experience_level) {
      const el = String(filters.experience_level).toUpperCase().trim();
      result = result.filter(j => j.experience_level === el);
    }

    if (filters.is_active !== undefined) {
      const active = Boolean(filters.is_active);
      result = result.filter(j => j.is_active === active);
    }

    return result.sort((a, b) => b.id - a.id).map(j => ({ ...j }));
  }

  createInMemory(data) {
    const newJob = {
      id: this.nextId++,
      title: data.title,
      company: data.company,
      description: data.description,
      requirements: data.requirements || null,
      location: data.location || '',
      work_model: data.work_model || 'HYBRID',
      type: data.type || 'FULL_TIME',
      experience_level: data.experience_level || 'MID',
      sector: data.sector || null,
      salary_min: data.salary_min !== undefined ? data.salary_min : null,
      salary_max: data.salary_max !== undefined ? data.salary_max : null,
      currency: data.currency || 'TRY',
      application_url: data.application_url || null,
      contact_email: data.contact_email || null,
      deadline: data.deadline || null,
      posted_by: data.posted_by ? parseInt(data.posted_by, 10) : null,
      is_active: data.is_active !== undefined ? Boolean(data.is_active) : true,
      view_count: data.view_count || 0,
      created_at: new Date().toISOString(),
      updated_at: null
    };

    this.inMemoryJobs.push(newJob);
    return { ...newJob };
  }

  updateInMemory(id, partialData) {
    const numericId = parseInt(id, 10);
    const job = this.inMemoryJobs.find(j => j.id === numericId);
    if (!job) return null;

    Object.assign(job, partialData);
    job.updated_at = new Date().toISOString();
    return { ...job };
  }

  deleteInMemory(id) {
    const numericId = parseInt(id, 10);
    const index = this.inMemoryJobs.findIndex(j => j.id === numericId);
    if (index === -1) return null;
    const [deleted] = this.inMemoryJobs.splice(index, 1);
    return deleted;
  }

  reset() {
    this.inMemoryJobs = [];
    this.nextId = 1;
    this.seedInitialData();
  }
}

export const jobPostingModel = new JobPostingModel();
export default jobPostingModel;
