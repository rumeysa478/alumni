/**
 * @file src/models/mentorship.model.js
 * @description Mentörlük Modeli (Mentorship Model) - Self-referential 1:N relations with Users (mentor_id & mentee_id)
 * @author Rumeysa Aydın
 */

import pool from '../database/connection.js';

const VALID_STATUSES = ['REQUESTED', 'ACTIVE', 'COMPLETED', 'DECLINED'];

class MentorshipModel {
  constructor() {
    this.inMemoryMentorships = [];
    this.nextId = 1;
    this.seedInitialData();
  }

  seedInitialData() {
    const seedData = [
      {
        mentor_id: 1,
        mentee_id: 2,
        status: 'ACTIVE',
        notes: 'Full Stack kariyer gelişimi ve portfolyo hazırlığı odaklı haftalık görüşmeler.',
        started_at: '2026-09-01T10:00:00.000Z'
      }
    ];

    seedData.forEach(m => this.createInMemory(m));
  }

  formatFromDb(row) {
    if (!row) return null;
    return {
      id: row.id,
      mentor_id: row.mentor_id,
      mentee_id: row.mentee_id,
      status: row.status || 'REQUESTED',
      notes: row.notes || '',
      started_at: row.started_at ? new Date(row.started_at).toISOString() : new Date().toISOString()
    };
  }

  async getAll(filters = {}) {
    try {
      let queryText = 'SELECT * FROM mentorships WHERE 1=1';
      const params = [];

      if (filters.mentor_id) {
        params.push(parseInt(filters.mentor_id, 10));
        queryText += ` AND mentor_id = $${params.length}`;
      }

      if (filters.mentee_id) {
        params.push(parseInt(filters.mentee_id, 10));
        queryText += ` AND mentee_id = $${params.length}`;
      }

      if (filters.status) {
        params.push(String(filters.status).toUpperCase().trim());
        queryText += ` AND status = $${params.length}`;
      }

      queryText += ' ORDER BY started_at DESC';

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
      const res = await pool.query('SELECT * FROM mentorships WHERE id = $1', [numericId]);
      if (res.rows.length === 0) return null;
      return this.formatFromDb(res.rows[0]);
    } catch {
      const m = this.inMemoryMentorships.find(item => item.id === numericId);
      return m ? { ...m } : null;
    }
  }

  async getByMentorId(mentorId) {
    return this.getAll({ mentor_id: mentorId });
  }

  async getByMenteeId(menteeId) {
    return this.getAll({ mentee_id: menteeId });
  }

  async getByUser(userId) {
    const numericUserId = parseInt(userId, 10);
    if (isNaN(numericUserId)) return [];

    try {
      const res = await pool.query(
        'SELECT * FROM mentorships WHERE mentor_id = $1 OR mentee_id = $1 ORDER BY started_at DESC',
        [numericUserId]
      );
      return res.rows.map(r => this.formatFromDb(r));
    } catch {
      return this.inMemoryMentorships
        .filter(m => m.mentor_id === numericUserId || m.mentee_id === numericUserId)
        .map(m => ({ ...m }));
    }
  }

  async create(data) {
    const { mentor_id, mentee_id, status = 'REQUESTED', notes = '' } = data;
    const numMentorId = parseInt(mentor_id, 10);
    const numMenteeId = parseInt(mentee_id, 10);

    if (isNaN(numMentorId) || isNaN(numMenteeId)) {
      throw new Error('mentor_id ve mentee_id zorunludur.');
    }

    if (numMentorId === numMenteeId) {
      throw new Error('Bir kullanıcı kendi kendisinin mentörü olamaz.');
    }

    try {
      const res = await pool.query(
        `INSERT INTO mentorships (mentor_id, mentee_id, status, notes)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [numMentorId, numMenteeId, status, notes]
      );
      return this.formatFromDb(res.rows[0]);
    } catch {
      return this.createInMemory(data);
    }
  }

  async updateStatus(id, status, notes = null) {
    const numericId = parseInt(id, 10);
    const upperStatus = String(status).toUpperCase().trim();

    if (!VALID_STATUSES.includes(upperStatus)) {
      throw new Error(`Geçersiz mentörlük durumu. Kabul edilenler: ${VALID_STATUSES.join(', ')}`);
    }

    try {
      let queryText = 'UPDATE mentorships SET status = $1';
      const params = [upperStatus];

      if (notes !== null) {
        params.push(notes);
        queryText += `, notes = $${params.length}`;
      }

      params.push(numericId);
      queryText += ` WHERE id = $${params.length} RETURNING *`;

      const res = await pool.query(queryText, params);
      if (res.rows.length === 0) return null;
      return this.formatFromDb(res.rows[0]);
    } catch {
      const m = this.inMemoryMentorships.find(item => item.id === numericId);
      if (!m) return null;
      m.status = upperStatus;
      if (notes !== null) m.notes = notes;
      return { ...m };
    }
  }

  async delete(id) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;

    try {
      const res = await pool.query('DELETE FROM mentorships WHERE id = $1 RETURNING *', [numericId]);
      if (res.rows.length === 0) return null;
      return this.formatFromDb(res.rows[0]);
    } catch {
      const index = this.inMemoryMentorships.findIndex(m => m.id === numericId);
      if (index === -1) return null;
      const [deleted] = this.inMemoryMentorships.splice(index, 1);
      return deleted;
    }
  }

  getAllInMemory(filters = {}) {
    let result = [...this.inMemoryMentorships];

    if (filters.mentor_id) {
      const mid = parseInt(filters.mentor_id, 10);
      result = result.filter(m => m.mentor_id === mid);
    }

    if (filters.mentee_id) {
      const mid = parseInt(filters.mentee_id, 10);
      result = result.filter(m => m.mentee_id === mid);
    }

    if (filters.status) {
      const st = String(filters.status).toUpperCase().trim();
      result = result.filter(m => m.status === st);
    }

    return result.sort((a, b) => new Date(b.started_at) - new Date(a.started_at)).map(m => ({ ...m }));
  }

  createInMemory(data) {
    const numMentorId = parseInt(data.mentor_id, 10);
    const numMenteeId = parseInt(data.mentee_id, 10);

    if (numMentorId === numMenteeId) {
      throw new Error('Bir kullanıcı kendi kendisinin mentörü olamaz.');
    }

    const newMentorship = {
      id: this.nextId++,
      mentor_id: numMentorId,
      mentee_id: numMenteeId,
      status: data.status || 'REQUESTED',
      notes: data.notes || '',
      started_at: new Date().toISOString()
    };

    this.inMemoryMentorships.push(newMentorship);
    return { ...newMentorship };
  }

  reset() {
    this.inMemoryMentorships = [];
    this.nextId = 1;
    this.seedInitialData();
  }
}

export const mentorshipModel = new MentorshipModel();
export default mentorshipModel;
