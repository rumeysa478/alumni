/**
 * @file src/models/announcement.model.js
 * @description PostgreSQL Veritabanı ve In-Memory Hibrit Duyuru Modeli (Database Connected Announcement Model)
 */

import pool from '../database/connection.js';

const VALID_CATEGORIES = ['EVENT', 'CAREER', 'ACADEMIC', 'GENERAL'];
const VALID_AUDIENCES = ['ALL', 'ALUMNI', 'STUDENT'];

class AnnouncementModel {
  constructor() {
    this.inMemoryAnnouncements = [];
    this.nextId = 1;
    this.seedInitialData();
  }

  /**
   * Başlangıç in-memory duyuru örnek verilerini yükler
   */
  seedInitialData() {
    const seedData = [
      {
        title: '🎓 2026 Mezunlar Günü ve Geleneksel Buluşma',
        content: 'Tüm mezunlarımızı ve son sınıf öğrencilerimizi kampüsümüzde gerçekleşecek geleneksel mezunlar günü etkinliğimize bekliyoruz. Kariyer deneyimleri, mentorluk oturumları ve müzik dinletisi yer alacaktır.',
        category: 'EVENT',
        author: 'Mezunlar Koordinatörlüğü',
        target_audience: 'ALL',
        is_active: true
      },
      {
        title: '💼 Partner Teknoloji Şirketinde Yeni Mezun & Staj Programı',
        content: 'Alumni ağımızın kurucu ve yöneticilerinin bulunduğu teknoloji firmalarında Yazılım Mühendisliği ve Veri Analitiği pozisyonları için başvurular açılmıştır.',
        category: 'CAREER',
        author: 'Kariyer ve Staj Merkezi',
        target_audience: 'STUDENT',
        is_active: true
      },
      {
        title: '📢 2026 Bahar Dönemi Mezuniyet Töreni Takvimi',
        content: 'Bahar dönemi diploma teslimleri, kep atma töreni ve mezuniyet balosu tarihleri kesinleşmiştir. Detaylar fakülte sekreterliklerinden öğrenilebilir.',
        category: 'ACADEMIC',
        author: 'Öğrenci İşleri Daire Başkanlığı',
        target_audience: 'ALUMNI',
        is_active: true
      }
    ];

    seedData.forEach(item => this.createInMemory(item));
  }

  /**
   * Veritabanı satırını standart duyuru objesine dönüştürür
   */
  formatAnnouncementFromDb(row) {
    if (!row) return null;
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      category: row.category,
      author: row.author,
      target_audience: row.target_audience,
      is_active: Boolean(row.is_active),
      created_at: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : null
    };
  }

  /**
   * Tüm duyuruları listeler (PostgreSQL DB -> In-Memory Fallback)
   * @param {Object} filters
   * @returns {Promise<Array>}
   */
  async getAll(filters = {}) {
    try {
      let queryText = 'SELECT * FROM announcements WHERE 1=1';
      const params = [];

      if (filters.search) {
        params.push(`%${String(filters.search).toLowerCase().trim()}%`);
        queryText += ` AND (LOWER(title) LIKE $${params.length} OR LOWER(content) LIKE $${params.length} OR LOWER(author) LIKE $${params.length})`;
      }

      if (filters.category) {
        params.push(String(filters.category).toUpperCase().trim());
        queryText += ` AND category = $${params.length}`;
      }

      if (filters.target_audience) {
        params.push(String(filters.target_audience).toUpperCase().trim());
        queryText += ` AND target_audience = $${params.length}`;
      }

      if (filters.is_active !== undefined && filters.is_active !== '') {
        const activeBool = Boolean(filters.is_active === true || filters.is_active === 'true' || filters.is_active === 'on');
        params.push(activeBool);
        queryText += ` AND is_active = $${params.length}`;
      }

      queryText += ' ORDER BY created_at DESC';

      const res = await pool.query(queryText, params);
      return res.rows.map(r => this.formatAnnouncementFromDb(r));
    } catch {
      return this.getAllInMemory(filters);
    }
  }

  /**
   * ID ile tekil duyuru bulur (PostgreSQL DB -> In-Memory Fallback)
   * @param {number|string} id
   * @returns {Promise<Object|null>}
   */
  async getById(id) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;

    try {
      const res = await pool.query('SELECT * FROM announcements WHERE id = $1', [numericId]);
      if (res.rows.length === 0) return null;
      return this.formatAnnouncementFromDb(res.rows[0]);
    } catch {
      return this.getByIdInMemory(numericId);
    }
  }

  /**
   * Yeni duyuru oluşturur (Create - C)
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async create(data) {
    const {
      title,
      content,
      category = 'GENERAL',
      author = 'Sistem Yöneticisi',
      target_audience = 'ALL',
      is_active = true
    } = data;

    if (!title || !String(title).trim()) {
      throw new Error('Duyuru başlığı (title) zorunludur.');
    }

    if (!content || !String(content).trim()) {
      throw new Error('Duyuru içeriği (content) zorunludur.');
    }

    const cat = String(category).toUpperCase().trim();
    const finalCategory = VALID_CATEGORIES.includes(cat) ? cat : 'GENERAL';

    const aud = String(target_audience).toUpperCase().trim();
    const finalAudience = VALID_AUDIENCES.includes(aud) ? aud : 'ALL';
    const activeBool = Boolean(is_active === true || is_active === 'true' || is_active === 'on');

    try {
      const res = await pool.query(
        `INSERT INTO announcements (title, content, category, author, target_audience, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [String(title).trim(), String(content).trim(), finalCategory, author ? String(author).trim() : 'Sistem Yöneticisi', finalAudience, activeBool]
      );
      const created = this.formatAnnouncementFromDb(res.rows[0]);
      this.inMemoryAnnouncements.push(created);
      return created;
    } catch {
      return this.createInMemory(data);
    }
  }

  /**
   * Duyuruyu tam günceller (Update - U)
   * @param {number|string} id
   * @param {Object} updateData
   * @returns {Promise<Object|null>}
   */
  async update(id, updateData) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;

    const {
      title,
      content,
      category,
      author,
      target_audience,
      is_active
    } = updateData;

    if (!title || !String(title).trim()) {
      throw new Error('Duyuru başlığı (title) zorunludur.');
    }

    if (!content || !String(content).trim()) {
      throw new Error('Duyuru içeriği (content) zorunludur.');
    }

    try {
      const existing = await this.getById(numericId);
      if (!existing) return null;

      const cat = category ? String(category).toUpperCase().trim() : existing.category;
      const finalCategory = VALID_CATEGORIES.includes(cat) ? cat : existing.category;

      const aud = target_audience ? String(target_audience).toUpperCase().trim() : existing.target_audience;
      const finalAudience = VALID_AUDIENCES.includes(aud) ? aud : existing.target_audience;

      const auth = author !== undefined ? String(author).trim() : existing.author;
      const activeBool = is_active !== undefined
        ? Boolean(is_active === true || is_active === 'true' || is_active === 'on')
        : existing.is_active;

      const res = await pool.query(
        `UPDATE announcements
         SET title = $1, content = $2, category = $3, author = $4, target_audience = $5, is_active = $6, updated_at = CURRENT_TIMESTAMP
         WHERE id = $7
         RETURNING *`,
        [String(title).trim(), String(content).trim(), finalCategory, auth, finalAudience, activeBool, numericId]
      );
      if (res.rows.length === 0) return null;
      const updated = this.formatAnnouncementFromDb(res.rows[0]);
      const idx = this.inMemoryAnnouncements.findIndex(a => a.id === numericId);
      if (idx !== -1) this.inMemoryAnnouncements[idx] = updated;
      return updated;
    } catch {
      return this.updateInMemory(id, updateData);
    }
  }

  /**
   * Duyuruyu kısmi günceller (Patch - U)
   * @param {number|string} id
   * @param {Object} partialData
   * @returns {Promise<Object|null>}
   */
  async patch(id, partialData) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;

    try {
      const existing = await this.getById(numericId);
      if (!existing) return null;

      const updateData = {
        title: partialData.title !== undefined ? partialData.title : existing.title,
        content: partialData.content !== undefined ? partialData.content : existing.content,
        category: partialData.category !== undefined ? partialData.category : existing.category,
        author: partialData.author !== undefined ? partialData.author : existing.author,
        target_audience: partialData.target_audience !== undefined ? partialData.target_audience : existing.target_audience,
        is_active: partialData.is_active !== undefined ? partialData.is_active : existing.is_active
      };

      return this.update(numericId, updateData);
    } catch {
      return this.patchInMemory(id, partialData);
    }
  }

  /**
   * Duyuruyu siler (Delete - D)
   * @param {number|string} id
   * @returns {Promise<Object|null>}
   */
  async delete(id) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;

    try {
      const res = await pool.query('DELETE FROM announcements WHERE id = $1 RETURNING *', [numericId]);
      if (res.rows.length === 0) {
        return this.deleteInMemory(id);
      }
      const deleted = this.formatAnnouncementFromDb(res.rows[0]);
      const idx = this.inMemoryAnnouncements.findIndex(a => a.id === numericId);
      if (idx !== -1) this.inMemoryAnnouncements.splice(idx, 1);
      return deleted;
    } catch {
      return this.deleteInMemory(id);
    }
  }

  // ==========================================
  // IN-MEMORY METODLAR (OFFLINE / TEST FALLBACK)
  // ==========================================

  getAllInMemory(filters = {}) {
    let result = [...this.inMemoryAnnouncements];

    if (filters.search) {
      const q = String(filters.search).toLowerCase().trim();
      result = result.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        (a.author && a.author.toLowerCase().includes(q))
      );
    }

    if (filters.category) {
      const cat = String(filters.category).toUpperCase().trim();
      result = result.filter(a => a.category === cat);
    }

    if (filters.target_audience) {
      const aud = String(filters.target_audience).toUpperCase().trim();
      result = result.filter(a => a.target_audience === aud);
    }

    if (filters.is_active !== undefined && filters.is_active !== '') {
      const activeBool = Boolean(filters.is_active === true || filters.is_active === 'true' || filters.is_active === 'on');
      result = result.filter(a => a.is_active === activeBool);
    }

    return result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  getByIdInMemory(id) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;
    return this.inMemoryAnnouncements.find(a => a.id === numericId) || null;
  }

  createInMemory(data) {
    const {
      title,
      content,
      category = 'GENERAL',
      author = 'Sistem Yöneticisi',
      target_audience = 'ALL',
      is_active = true
    } = data;

    if (!title || !String(title).trim()) {
      throw new Error('Duyuru başlığı (title) zorunludur.');
    }

    if (!content || !String(content).trim()) {
      throw new Error('Duyuru içeriği (content) zorunludur.');
    }

    const cat = String(category).toUpperCase().trim();
    const finalCategory = VALID_CATEGORIES.includes(cat) ? cat : 'GENERAL';

    const aud = String(target_audience).toUpperCase().trim();
    const finalAudience = VALID_AUDIENCES.includes(aud) ? aud : 'ALL';

    const newAnnouncement = {
      id: this.nextId++,
      title: String(title).trim(),
      content: String(content).trim(),
      category: finalCategory,
      author: author ? String(author).trim() : 'Sistem Yöneticisi',
      target_audience: finalAudience,
      is_active: Boolean(is_active === true || is_active === 'true' || is_active === 'on'),
      created_at: new Date().toISOString(),
      updated_at: null
    };

    this.inMemoryAnnouncements.push(newAnnouncement);
    return newAnnouncement;
  }

  updateInMemory(id, updateData) {
    const announcement = this.getByIdInMemory(id);
    if (!announcement) return null;

    const {
      title,
      content,
      category,
      author,
      target_audience,
      is_active
    } = updateData;

    if (!title || !String(title).trim()) {
      throw new Error('Duyuru başlığı (title) zorunludur.');
    }

    if (!content || !String(content).trim()) {
      throw new Error('Duyuru içeriği (content) zorunludur.');
    }

    announcement.title = String(title).trim();
    announcement.content = String(content).trim();

    if (category) {
      const cat = String(category).toUpperCase().trim();
      announcement.category = VALID_CATEGORIES.includes(cat) ? cat : announcement.category;
    }

    if (author !== undefined) {
      announcement.author = String(author).trim();
    }

    if (target_audience) {
      const aud = String(target_audience).toUpperCase().trim();
      announcement.target_audience = VALID_AUDIENCES.includes(aud) ? aud : announcement.target_audience;
    }

    if (is_active !== undefined) {
      announcement.is_active = Boolean(is_active === true || is_active === 'true' || is_active === 'on');
    }

    announcement.updated_at = new Date().toISOString();
    return announcement;
  }

  patchInMemory(id, partialData) {
    const announcement = this.getByIdInMemory(id);
    if (!announcement) return null;

    const {
      title,
      content,
      category,
      author,
      target_audience,
      is_active
    } = partialData;

    if (title !== undefined) {
      if (!String(title).trim()) {
        throw new Error('Duyuru başlığı (title) zorunludur.');
      }
      announcement.title = String(title).trim();
    }

    if (content !== undefined) {
      if (!String(content).trim()) {
        throw new Error('Duyuru içeriği (content) zorunludur.');
      }
      announcement.content = String(content).trim();
    }

    if (category !== undefined) {
      const cat = String(category).toUpperCase().trim();
      if (VALID_CATEGORIES.includes(cat)) {
        announcement.category = cat;
      }
    }

    if (author !== undefined) {
      announcement.author = String(author).trim();
    }

    if (target_audience !== undefined) {
      const aud = String(target_audience).toUpperCase().trim();
      if (VALID_AUDIENCES.includes(aud)) {
        announcement.target_audience = aud;
      }
    }

    if (is_active !== undefined) {
      announcement.is_active = Boolean(is_active === true || is_active === 'true' || is_active === 'on');
    }

    announcement.updated_at = new Date().toISOString();
    return announcement;
  }

  deleteInMemory(id) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;

    const index = this.inMemoryAnnouncements.findIndex(a => a.id === numericId);
    if (index === -1) return null;

    const [deleted] = this.inMemoryAnnouncements.splice(index, 1);
    return deleted;
  }

  reset() {
    this.inMemoryAnnouncements = [];
    this.nextId = 1;
    this.seedInitialData();
  }
}

export const announcementModel = new AnnouncementModel();
export default announcementModel;
