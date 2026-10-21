/**
 * @file src/models/alumniProfile.model.js
 * @description Mezun Profili Modeli (AlumniProfile Model) - 1:1 users ile ilişkili
 * @author Rumeysa Aydın
 */

import pool from '../database/connection.js';

class AlumniProfileModel {
  constructor() {
    this.inMemoryProfiles = [];
    this.nextId = 1;
    this.seedInitialData();
  }

  seedInitialData() {
    const seedData = [
      {
        user_id: 1,
        current_company: 'Tech Global Solutions',
        current_title: 'Full Stack Developer',
        city: 'İstanbul',
        country: 'Türkiye',
        bio: 'YBS mezunu, Node.js ve React ekosisteminde uzmanlaşmış Full Stack yazılım geliştirici.',
        linkedin_url: 'https://linkedin.com/in/rumeysaaydin',
        github_url: 'https://github.com/rumeysa478',
        phone: '+90 555 123 4567',
        resume_url: '/uploads/resumes/rumeysa_cv.pdf'
      },
      {
        user_id: 3,
        current_company: 'Cyber Security Corp',
        current_title: 'DevOps & Cloud Engineer',
        city: 'Ankara',
        country: 'Türkiye',
        bio: 'Bulut altyapıları, CI/CD süreçleri ve Kubernetes mimarisi üzerine çalışan mühendis.',
        linkedin_url: 'https://linkedin.com/in/zeynepkaya',
        github_url: 'https://github.com/zeynepkaya',
        phone: '+90 555 987 6543',
        resume_url: '/uploads/resumes/zeynep_cv.pdf'
      }
    ];

    seedData.forEach(p => this.createInMemory(p));
  }

  formatFromDb(row) {
    if (!row) return null;
    return {
      id: row.id,
      user_id: row.user_id,
      current_company: row.current_company || '',
      current_title: row.current_title || '',
      city: row.city || '',
      country: row.country || 'Türkiye',
      bio: row.bio || '',
      linkedin_url: row.linkedin_url || '',
      github_url: row.github_url || '',
      phone: row.phone || '',
      resume_url: row.resume_url || '',
      created_at: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : null
    };
  }

  async getAll() {
    try {
      const res = await pool.query('SELECT * FROM alumni_profiles ORDER BY id ASC');
      return res.rows.map(r => this.formatFromDb(r));
    } catch {
      return this.inMemoryProfiles.map(p => ({ ...p }));
    }
  }

  async getById(id) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;

    try {
      const res = await pool.query('SELECT * FROM alumni_profiles WHERE id = $1', [numericId]);
      if (res.rows.length === 0) return null;
      return this.formatFromDb(res.rows[0]);
    } catch {
      const profile = this.inMemoryProfiles.find(p => p.id === numericId);
      return profile ? { ...profile } : null;
    }
  }

  async getByUserId(userId) {
    const numericUserId = parseInt(userId, 10);
    if (isNaN(numericUserId)) return null;

    try {
      const res = await pool.query('SELECT * FROM alumni_profiles WHERE user_id = $1', [numericUserId]);
      if (res.rows.length === 0) return null;
      return this.formatFromDb(res.rows[0]);
    } catch {
      const profile = this.inMemoryProfiles.find(p => p.user_id === numericUserId);
      return profile ? { ...profile } : null;
    }
  }

  async create(data) {
    const {
      user_id,
      current_company = '',
      current_title = '',
      city = '',
      country = 'Türkiye',
      bio = '',
      linkedin_url = '',
      github_url = '',
      phone = '',
      resume_url = ''
    } = data;

    const numericUserId = parseInt(user_id, 10);
    if (isNaN(numericUserId)) {
      throw new Error('user_id zorunludur ve sayısal olmalıdır.');
    }

    try {
      const res = await pool.query(
        `INSERT INTO alumni_profiles (
          user_id, current_company, current_title, city, country,
          bio, linkedin_url, github_url, phone, resume_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [numericUserId, current_company, current_title, city, country, bio, linkedin_url, github_url, phone, resume_url]
      );
      return this.formatFromDb(res.rows[0]);
    } catch (err) {
      if (err.code === '23505') {
        const error = new Error('Bu kullanıcının zaten bir profili bulunmaktadır.');
        error.code = 409;
        throw error;
      }
      return this.createInMemory({
        user_id: numericUserId,
        current_company,
        current_title,
        city,
        country,
        bio,
        linkedin_url,
        github_url,
        phone,
        resume_url
      });
    }
  }

  async updateByUserId(userId, partialData) {
    const numericUserId = parseInt(userId, 10);
    if (isNaN(numericUserId)) return null;

    try {
      const existing = await this.getByUserId(numericUserId);
      if (!existing) return null;

      const updated = {
        current_company: partialData.current_company !== undefined ? partialData.current_company : existing.current_company,
        current_title: partialData.current_title !== undefined ? partialData.current_title : existing.current_title,
        city: partialData.city !== undefined ? partialData.city : existing.city,
        country: partialData.country !== undefined ? partialData.country : existing.country,
        bio: partialData.bio !== undefined ? partialData.bio : existing.bio,
        linkedin_url: partialData.linkedin_url !== undefined ? partialData.linkedin_url : existing.linkedin_url,
        github_url: partialData.github_url !== undefined ? partialData.github_url : existing.github_url,
        phone: partialData.phone !== undefined ? partialData.phone : existing.phone,
        resume_url: partialData.resume_url !== undefined ? partialData.resume_url : existing.resume_url
      };

      const res = await pool.query(
        `UPDATE alumni_profiles SET
          current_company = $1, current_title = $2, city = $3, country = $4,
          bio = $5, linkedin_url = $6, github_url = $7, phone = $8, resume_url = $9,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $10
        RETURNING *`,
        [
          updated.current_company, updated.current_title, updated.city, updated.country,
          updated.bio, updated.linkedin_url, updated.github_url, updated.phone, updated.resume_url,
          numericUserId
        ]
      );
      return this.formatFromDb(res.rows[0]);
    } catch {
      return this.updateInMemory(numericUserId, partialData);
    }
  }

  async deleteByUserId(userId) {
    const numericUserId = parseInt(userId, 10);
    if (isNaN(numericUserId)) return null;

    try {
      const res = await pool.query('DELETE FROM alumni_profiles WHERE user_id = $1 RETURNING *', [numericUserId]);
      if (res.rows.length === 0) return null;
      return this.formatFromDb(res.rows[0]);
    } catch {
      return this.deleteInMemory(numericUserId);
    }
  }

  createInMemory(data) {
    const numericUserId = parseInt(data.user_id, 10);
    const existing = this.inMemoryProfiles.find(p => p.user_id === numericUserId);
    if (existing) {
      const err = new Error('Bu kullanıcının zaten bir profili bulunmaktadır.');
      err.code = 409;
      throw err;
    }

    const newProfile = {
      id: this.nextId++,
      user_id: numericUserId,
      current_company: data.current_company || '',
      current_title: data.current_title || '',
      city: data.city || '',
      country: data.country || 'Türkiye',
      bio: data.bio || '',
      linkedin_url: data.linkedin_url || '',
      github_url: data.github_url || '',
      phone: data.phone || '',
      resume_url: data.resume_url || '',
      created_at: new Date().toISOString(),
      updated_at: null
    };

    this.inMemoryProfiles.push(newProfile);
    return { ...newProfile };
  }

  updateInMemory(userId, partialData) {
    const numericUserId = parseInt(userId, 10);
    const profile = this.inMemoryProfiles.find(p => p.user_id === numericUserId);
    if (!profile) return null;

    Object.assign(profile, partialData);
    profile.updated_at = new Date().toISOString();
    return { ...profile };
  }

  deleteInMemory(userId) {
    const numericUserId = parseInt(userId, 10);
    const index = this.inMemoryProfiles.findIndex(p => p.user_id === numericUserId);
    if (index === -1) return null;
    const [deleted] = this.inMemoryProfiles.splice(index, 1);
    return deleted;
  }

  reset() {
    this.inMemoryProfiles = [];
    this.nextId = 1;
    this.seedInitialData();
  }
}

export const alumniProfileModel = new AlumniProfileModel();
export default alumniProfileModel;
