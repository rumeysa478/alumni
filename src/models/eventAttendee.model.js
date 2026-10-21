/**
 * @file src/models/eventAttendee.model.js
 * @description Etkinlik Katılımcı Modeli (EventAttendee Model) - N:M Bridge between Users and Events
 * @author Rumeysa Aydın
 */

import pool from '../database/connection.js';

const VALID_STATUSES = ['REGISTERED', 'ATTENDED', 'CANCELLED'];

class EventAttendeeModel {
  constructor() {
    this.inMemoryAttendees = [];
    this.nextId = 1;
    this.seedInitialData();
  }

  seedInitialData() {
    const seedData = [
      {
        event_id: 1,
        user_id: 1,
        status: 'REGISTERED'
      },
      {
        event_id: 1,
        user_id: 2,
        status: 'REGISTERED'
      }
    ];

    seedData.forEach(att => this.createInMemory(att));
  }

  formatFromDb(row) {
    if (!row) return null;
    return {
      id: row.id,
      event_id: row.event_id,
      user_id: row.user_id,
      registered_at: row.registered_at ? new Date(row.registered_at).toISOString() : new Date().toISOString(),
      status: row.status || 'REGISTERED'
    };
  }

  async getAll(filters = {}) {
    try {
      let queryText = 'SELECT * FROM event_attendees WHERE 1=1';
      const params = [];

      if (filters.event_id) {
        params.push(parseInt(filters.event_id, 10));
        queryText += ` AND event_id = $${params.length}`;
      }

      if (filters.user_id) {
        params.push(parseInt(filters.user_id, 10));
        queryText += ` AND user_id = $${params.length}`;
      }

      if (filters.status) {
        params.push(String(filters.status).toUpperCase().trim());
        queryText += ` AND status = $${params.length}`;
      }

      queryText += ' ORDER BY registered_at DESC';

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
      const res = await pool.query('SELECT * FROM event_attendees WHERE id = $1', [numericId]);
      if (res.rows.length === 0) return null;
      return this.formatFromDb(res.rows[0]);
    } catch {
      const att = this.inMemoryAttendees.find(a => a.id === numericId);
      return att ? { ...att } : null;
    }
  }

  async getByEventId(eventId) {
    return this.getAll({ event_id: eventId });
  }

  async getByUserId(userId) {
    return this.getAll({ user_id: userId });
  }

  async getByEventAndUser(eventId, userId) {
    const numEventId = parseInt(eventId, 10);
    const numUserId = parseInt(userId, 10);

    try {
      const res = await pool.query(
        'SELECT * FROM event_attendees WHERE event_id = $1 AND user_id = $2',
        [numEventId, numUserId]
      );
      if (res.rows.length === 0) return null;
      return this.formatFromDb(res.rows[0]);
    } catch {
      const att = this.inMemoryAttendees.find(a => a.event_id === numEventId && a.user_id === numUserId);
      return att ? { ...att } : null;
    }
  }

  async register(eventId, userId) {
    const numEventId = parseInt(eventId, 10);
    const numUserId = parseInt(userId, 10);

    if (isNaN(numEventId) || isNaN(numUserId)) {
      throw new Error('event_id ve user_id zorunludur.');
    }

    try {
      const res = await pool.query(
        `INSERT INTO event_attendees (event_id, user_id, status)
         VALUES ($1, $2, 'REGISTERED')
         RETURNING *`,
        [numEventId, numUserId]
      );
      return this.formatFromDb(res.rows[0]);
    } catch (err) {
      if (err.code === '23505') {
        const error = new Error('Bu kullanıcı etkinliğe zaten kayıtlı.');
        error.code = 409;
        throw error;
      }
      return this.createInMemory({
        event_id: numEventId,
        user_id: numUserId,
        status: 'REGISTERED'
      });
    }
  }

  async updateStatus(id, status) {
    const numericId = parseInt(id, 10);
    const upperStatus = String(status).toUpperCase().trim();

    if (!VALID_STATUSES.includes(upperStatus)) {
      throw new Error(`Geçersiz katılım durumu. Kabul edilenler: ${VALID_STATUSES.join(', ')}`);
    }

    try {
      const res = await pool.query(
        'UPDATE event_attendees SET status = $1 WHERE id = $2 RETURNING *',
        [upperStatus, numericId]
      );
      if (res.rows.length === 0) return null;
      return this.formatFromDb(res.rows[0]);
    } catch {
      const att = this.inMemoryAttendees.find(a => a.id === numericId);
      if (!att) return null;
      att.status = upperStatus;
      return { ...att };
    }
  }

  async cancel(eventId, userId) {
    const numEventId = parseInt(eventId, 10);
    const numUserId = parseInt(userId, 10);

    try {
      const res = await pool.query(
        'DELETE FROM event_attendees WHERE event_id = $1 AND user_id = $2 RETURNING *',
        [numEventId, numUserId]
      );
      if (res.rows.length === 0) return null;
      return this.formatFromDb(res.rows[0]);
    } catch {
      const index = this.inMemoryAttendees.findIndex(a => a.event_id === numEventId && a.user_id === numUserId);
      if (index === -1) return null;
      const [deleted] = this.inMemoryAttendees.splice(index, 1);
      return deleted;
    }
  }

  getAllInMemory(filters = {}) {
    let result = [...this.inMemoryAttendees];

    if (filters.event_id) {
      const eid = parseInt(filters.event_id, 10);
      result = result.filter(a => a.event_id === eid);
    }

    if (filters.user_id) {
      const uid = parseInt(filters.user_id, 10);
      result = result.filter(a => a.user_id === uid);
    }

    if (filters.status) {
      const st = String(filters.status).toUpperCase().trim();
      result = result.filter(a => a.status === st);
    }

    return result.sort((a, b) => new Date(b.registered_at) - new Date(a.registered_at)).map(a => ({ ...a }));
  }

  createInMemory(data) {
    const numEventId = parseInt(data.event_id, 10);
    const numUserId = parseInt(data.user_id, 10);

    const existing = this.inMemoryAttendees.find(a => a.event_id === numEventId && a.user_id === numUserId);
    if (existing) {
      const error = new Error('Bu kullanıcı etkinliğe zaten kayıtlı.');
      error.code = 409;
      throw error;
    }

    const newAttendee = {
      id: this.nextId++,
      event_id: numEventId,
      user_id: numUserId,
      registered_at: new Date().toISOString(),
      status: data.status || 'REGISTERED'
    };

    this.inMemoryAttendees.push(newAttendee);
    return { ...newAttendee };
  }

  reset() {
    this.inMemoryAttendees = [];
    this.nextId = 1;
    this.seedInitialData();
  }
}

export const eventAttendeeModel = new EventAttendeeModel();
export default eventAttendeeModel;
