/**
 * @file src/models/user.model.js
 * @description PostgreSQL Veritabanı ve In-Memory Hibrit Kullanıcı Modeli (Database Connected User Model)
 */

import pool from '../database/connection.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_ROLES = ['STUDENT', 'ALUMNI', 'ADMIN'];

class UserModel {
  constructor() {
    this.inMemoryUsers = [];
    this.nextId = 1;
    this.seedInitialData();
  }

  /**
   * Başlangıç in-memory örnek verilerini yükler
   */
  seedInitialData() {
    const seedUsers = [
      {
        email: 'rumeysa.aydin@alumni.edu',
        password: 'password123',
        first_name: 'Rümeysa',
        last_name: 'Aydın',
        role: 'ALUMNI',
        department: 'Yönetim Bilişim Sistemleri',
        graduation_year: 2024,
        is_verified: true
      },
      {
        email: 'ahmet.yilmaz@alumni.edu',
        password: 'password123',
        first_name: 'Ahmet',
        last_name: 'Yılmaz',
        role: 'STUDENT',
        department: 'Bilgisayar Mühendisliği',
        graduation_year: 2026,
        is_verified: true
      },
      {
        email: 'zeynep.kaya@alumni.edu',
        password: 'password123',
        first_name: 'Zeynep',
        last_name: 'Kaya',
        role: 'ADMIN',
        department: 'Yazılım Mühendisliği',
        graduation_year: 2022,
        is_verified: true
      }
    ];

    seedUsers.forEach(u => this.createInMemory(u));
  }

  /**
   * Veritabanı satırını standart kullanıcı objesine dönüştürür
   */
  formatUserFromDb(row) {
    if (!row) return null;
    return {
      id: row.id,
      email: row.email,
      password: row.password_hash || row.password || '',
      password_hash: row.password_hash,
      first_name: row.first_name,
      last_name: row.last_name,
      role: row.role,
      department: row.department || '',
      graduation_year: row.graduation_year ? parseInt(row.graduation_year, 10) : null,
      is_verified: Boolean(row.is_verified),
      created_at: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : null
    };
  }

  /**
   * Tüm kullanıcıları döner (PostgreSQL DB -> In-Memory Fallback)
   * @param {Object} filters
   * @returns {Promise<Array>}
   */
  async getAll(filters = {}) {
    try {
      let queryText = 'SELECT * FROM users WHERE 1=1';
      const params = [];

      if (filters.search) {
        params.push(`%${String(filters.search).toLowerCase().trim()}%`);
        queryText += ` AND (LOWER(first_name) LIKE $${params.length} OR LOWER(last_name) LIKE $${params.length} OR LOWER(email) LIKE $${params.length} OR LOWER(department) LIKE $${params.length})`;
      }

      if (filters.role) {
        params.push(String(filters.role).toUpperCase().trim());
        queryText += ` AND role = $${params.length}`;
      }

      if (filters.department) {
        params.push(`%${String(filters.department).toLowerCase().trim()}%`);
        queryText += ` AND LOWER(department) LIKE $${params.length}`;
      }

      queryText += ' ORDER BY id ASC';

      const res = await pool.query(queryText, params);
      return res.rows.map(r => this.formatUserFromDb(r));
    } catch {
      return this.getAllInMemory(filters);
    }
  }

  /**
   * ID'ye göre tekil kullanıcı bulur (PostgreSQL DB -> In-Memory Fallback)
   * @param {number|string} id
   * @returns {Promise<Object|null>}
   */
  async getById(id) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;

    try {
      const res = await pool.query('SELECT * FROM users WHERE id = $1', [numericId]);
      if (res.rows.length === 0) return null;
      return this.formatUserFromDb(res.rows[0]);
    } catch {
      return this.getByIdInMemory(numericId);
    }
  }

  /**
   * E-posta adresine göre kullanıcı bulur
   * @param {string} email
   * @returns {Promise<Object|null>}
   */
  async getByEmail(email) {
    if (!email) return null;
    const cleanEmail = String(email).trim().toLowerCase();

    try {
      const res = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [cleanEmail]);
      if (res.rows.length === 0) return null;
      return this.formatUserFromDb(res.rows[0]);
    } catch {
      return this.getByEmailInMemory(cleanEmail);
    }
  }

  /**
   * Yeni kullanıcı oluşturur (Create - C)
   * @param {Object} userData
   * @returns {Promise<Object>}
   */
  async create(userData) {
    const {
      email,
      password,
      first_name = '',
      last_name = '',
      role = 'ALUMNI',
      department = '',
      graduation_year = null,
      is_verified = false
    } = userData;

    if (!email || !String(email).trim()) {
      throw new Error('E-posta (email) alanı zorunludur.');
    }

    const cleanEmail = String(email).trim().toLowerCase();
    if (!EMAIL_REGEX.test(cleanEmail)) {
      throw new Error('Geçerli bir e-posta adresi giriniz.');
    }

    const userRole = String(role).toUpperCase().trim();
    if (!VALID_ROLES.includes(userRole)) {
      throw new Error(`Geçersiz rol. Kabul edilen roller: ${VALID_ROLES.join(', ')}`);
    }

    const gradYear = graduation_year ? parseInt(graduation_year, 10) || null : null;
    const isVerifiedBool = Boolean(is_verified === true || is_verified === 'true' || is_verified === 'on');

    try {
      const existingUser = await this.getByEmail(cleanEmail);
      if (existingUser) {
        const err = new Error('Bu e-posta adresiyle kayıtlı bir kullanıcı zaten mevcut.');
        err.code = 409;
        throw err;
      }

      const res = await pool.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, role, department, graduation_year, is_verified)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          cleanEmail,
          password ? String(password).trim() : 'secret123',
          first_name ? String(first_name).trim() : '',
          last_name ? String(last_name).trim() : '',
          userRole,
          department ? String(department).trim() : '',
          gradYear,
          isVerifiedBool
        ]
      );
      const created = this.formatUserFromDb(res.rows[0]);
      this.inMemoryUsers.push(created);
      return created;
    } catch (err) {
      if (err.code === 409 || err.code === '23505') {
        const conflictErr = new Error('Bu e-posta adresiyle kayıtlı bir kullanıcı zaten mevcut.');
        conflictErr.code = 409;
        throw conflictErr;
      }
      return this.createInMemory(userData);
    }
  }

  /**
   * Kullanıcıyı tam günceller (Update - U)
   * @param {number|string} id
   * @param {Object} updateData
   * @returns {Promise<Object|null>}
   */
  async update(id, updateData) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;

    try {
      const existing = await this.getById(numericId);
      if (!existing) return null;

      const {
        email,
        password,
        first_name,
        last_name,
        role,
        department,
        graduation_year,
        is_verified
      } = updateData;

      let cleanEmail = existing.email;
      if (email !== undefined && email !== null) {
        cleanEmail = String(email).trim().toLowerCase();
        if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
          throw new Error('Geçerli bir e-posta adresi giriniz.');
        }
        const userByMail = await this.getByEmail(cleanEmail);
        if (userByMail && userByMail.id !== numericId) {
          const err = new Error('Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor.');
          err.code = 409;
          throw err;
        }
      }

      let userRole = existing.role;
      if (role !== undefined && role !== null) {
        userRole = String(role).toUpperCase().trim();
        if (!VALID_ROLES.includes(userRole)) {
          throw new Error(`Geçersiz rol. Kabul edilen roller: ${VALID_ROLES.join(', ')}`);
        }
      }

      const pass = password !== undefined && password !== null && String(password).trim()
        ? String(password).trim()
        : existing.password;
      const fn = first_name !== undefined ? String(first_name).trim() : '';
      const ln = last_name !== undefined ? String(last_name).trim() : '';
      const dep = department !== undefined ? String(department).trim() : '';
      const gy = graduation_year !== undefined ? (parseInt(graduation_year, 10) || null) : null;
      const ver = is_verified !== undefined ? Boolean(is_verified === true || is_verified === 'true' || is_verified === 'on') : existing.is_verified;

      const res = await pool.query(
        `UPDATE users
         SET email = $1, password_hash = $2, first_name = $3, last_name = $4, role = $5, department = $6, graduation_year = $7, is_verified = $8, updated_at = CURRENT_TIMESTAMP
         WHERE id = $9
         RETURNING *`,
        [cleanEmail, pass, fn, ln, userRole, dep, gy, ver, numericId]
      );
      if (res.rows.length === 0) return null;
      const updated = this.formatUserFromDb(res.rows[0]);
      const idx = this.inMemoryUsers.findIndex(u => u.id === numericId);
      if (idx !== -1) this.inMemoryUsers[idx] = updated;
      return updated;
    } catch (err) {
      if (err.code === 409 || err.code === '23505') throw err;
      if (err.message && err.message.includes('Geçerli bir e-posta')) throw err;
      return this.updateInMemory(id, updateData);
    }
  }

  /**
   * Kullanıcıyı kısmi günceller (Patch - U)
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
        email: partialData.email !== undefined ? partialData.email : existing.email,
        password: partialData.password !== undefined ? partialData.password : existing.password,
        first_name: partialData.first_name !== undefined ? partialData.first_name : existing.first_name,
        last_name: partialData.last_name !== undefined ? partialData.last_name : existing.last_name,
        role: partialData.role !== undefined ? partialData.role : existing.role,
        department: partialData.department !== undefined ? partialData.department : existing.department,
        graduation_year: partialData.graduation_year !== undefined ? partialData.graduation_year : existing.graduation_year,
        is_verified: partialData.is_verified !== undefined ? partialData.is_verified : existing.is_verified
      };

      return this.update(numericId, updateData);
    } catch (err) {
      if (err.code === 409 || err.code === '23505') throw err;
      return this.patchInMemory(id, partialData);
    }
  }

  /**
   * Kullanıcıyı siler (Delete - D)
   * @param {number|string} id
   * @returns {Promise<Object|null>}
   */
  async delete(id) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;

    try {
      const res = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [numericId]);
      if (res.rows.length === 0) {
        return this.deleteInMemory(id);
      }
      const deleted = this.formatUserFromDb(res.rows[0]);
      const idx = this.inMemoryUsers.findIndex(u => u.id === numericId);
      if (idx !== -1) this.inMemoryUsers.splice(idx, 1);
      return deleted;
    } catch {
      return this.deleteInMemory(id);
    }
  }

  // ==========================================
  // IN-MEMORY METODLAR (OFFLINE / TEST FALLBACK)
  // ==========================================

  getAllInMemory(filters = {}) {
    let result = [...this.inMemoryUsers];

    if (filters.search) {
      const q = String(filters.search).toLowerCase().trim();
      result = result.filter(u =>
        u.first_name.toLowerCase().includes(q) ||
        u.last_name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.department && u.department.toLowerCase().includes(q))
      );
    }

    if (filters.role) {
      const r = String(filters.role).toUpperCase().trim();
      result = result.filter(u => u.role === r);
    }

    if (filters.department) {
      const d = String(filters.department).toLowerCase().trim();
      result = result.filter(u => u.department && u.department.toLowerCase().includes(d));
    }

    return result;
  }

  getByIdInMemory(id) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;
    return this.inMemoryUsers.find(u => u.id === numericId) || null;
  }

  getByEmailInMemory(email) {
    if (!email) return null;
    const cleanEmail = String(email).trim().toLowerCase();
    return this.inMemoryUsers.find(u => u.email.toLowerCase() === cleanEmail) || null;
  }

  createInMemory(userData) {
    const {
      email,
      password,
      first_name = '',
      last_name = '',
      role = 'ALUMNI',
      department = '',
      graduation_year = null,
      is_verified = false
    } = userData;

    if (!email || !String(email).trim()) {
      throw new Error('E-posta (email) alanı zorunludur.');
    }

    const cleanEmail = String(email).trim().toLowerCase();
    if (!EMAIL_REGEX.test(cleanEmail)) {
      throw new Error('Geçerli bir e-posta adresi giriniz.');
    }

    const existingUser = this.getByEmailInMemory(cleanEmail);
    if (existingUser) {
      const err = new Error('Bu e-posta adresiyle kayıtlı bir kullanıcı zaten mevcut.');
      err.code = 409;
      throw err;
    }

    const userRole = String(role).toUpperCase().trim();
    if (!VALID_ROLES.includes(userRole)) {
      throw new Error(`Geçersiz rol. Kabul edilen roller: ${VALID_ROLES.join(', ')}`);
    }

    const newUser = {
      id: this.nextId++,
      email: cleanEmail,
      password: password ? String(password).trim() : 'secret123',
      first_name: first_name ? String(first_name).trim() : '',
      last_name: last_name ? String(last_name).trim() : '',
      role: userRole,
      department: department ? String(department).trim() : '',
      graduation_year: graduation_year ? parseInt(graduation_year, 10) || null : null,
      is_verified: Boolean(is_verified === true || is_verified === 'true' || is_verified === 'on'),
      created_at: new Date().toISOString(),
      updated_at: null
    };

    this.inMemoryUsers.push(newUser);
    return newUser;
  }

  updateInMemory(id, updateData) {
    const user = this.getByIdInMemory(id);
    if (!user) return null;

    const {
      email,
      password,
      first_name,
      last_name,
      role,
      department,
      graduation_year,
      is_verified
    } = updateData;

    if (email !== undefined && email !== null) {
      const cleanEmail = String(email).trim().toLowerCase();
      if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
        throw new Error('Geçerli bir e-posta adresi giriniz.');
      }
      const existing = this.getByEmailInMemory(cleanEmail);
      if (existing && existing.id !== user.id) {
        const err = new Error('Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor.');
        err.code = 409;
        throw err;
      }
      user.email = cleanEmail;
    }

    if (role !== undefined && role !== null) {
      const userRole = String(role).toUpperCase().trim();
      if (!VALID_ROLES.includes(userRole)) {
        throw new Error(`Geçersiz rol. Kabul edilen roller: ${VALID_ROLES.join(', ')}`);
      }
      user.role = userRole;
    }

    if (password !== undefined && password !== null && String(password).trim()) {
      user.password = String(password).trim();
    }

    user.first_name = first_name !== undefined ? String(first_name).trim() : '';
    user.last_name = last_name !== undefined ? String(last_name).trim() : '';
    user.department = department !== undefined ? String(department).trim() : '';
    user.graduation_year = graduation_year !== undefined
      ? (parseInt(graduation_year, 10) || null)
      : null;

    if (is_verified !== undefined) {
      user.is_verified = Boolean(is_verified === true || is_verified === 'true' || is_verified === 'on');
    }

    user.updated_at = new Date().toISOString();
    return user;
  }

  patchInMemory(id, partialData) {
    const user = this.getByIdInMemory(id);
    if (!user) return null;

    const {
      email,
      password,
      first_name,
      last_name,
      role,
      department,
      graduation_year,
      is_verified
    } = partialData;

    if (email !== undefined && email !== null) {
      const cleanEmail = String(email).trim().toLowerCase();
      if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
        throw new Error('Geçerli bir e-posta adresi giriniz.');
      }
      const existing = this.getByEmailInMemory(cleanEmail);
      if (existing && existing.id !== user.id) {
        const err = new Error('Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor.');
        err.code = 409;
        throw err;
      }
      user.email = cleanEmail;
    }

    if (role !== undefined && role !== null) {
      const userRole = String(role).toUpperCase().trim();
      if (!VALID_ROLES.includes(userRole)) {
        throw new Error(`Geçersiz rol. Kabul edilen roller: ${VALID_ROLES.join(', ')}`);
      }
      user.role = userRole;
    }

    if (password !== undefined && password !== null && String(password).trim()) {
      user.password = String(password).trim();
    }
    if (first_name !== undefined) user.first_name = String(first_name).trim();
    if (last_name !== undefined) user.last_name = String(last_name).trim();
    if (department !== undefined) user.department = String(department).trim();
    if (graduation_year !== undefined) {
      user.graduation_year = parseInt(graduation_year, 10) || null;
    }
    if (is_verified !== undefined) {
      user.is_verified = Boolean(is_verified === true || is_verified === 'true' || is_verified === 'on');
    }

    user.updated_at = new Date().toISOString();
    return user;
  }

  deleteInMemory(id) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;

    const index = this.inMemoryUsers.findIndex(u => u.id === numericId);
    if (index === -1) return null;

    const [deletedUser] = this.inMemoryUsers.splice(index, 1);
    return deletedUser;
  }

  /**
   * In-memory verileri sıfırlar (Testler için)
   */
  reset() {
    this.inMemoryUsers = [];
    this.nextId = 1;
    this.seedInitialData();
  }
}

// Singleton User Model nesnesi
export const userModel = new UserModel();
export default userModel;
