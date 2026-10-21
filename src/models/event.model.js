/**
 * @file src/models/event.model.js
 * @description Etkinlik Modeli (Event Model) - 1:N users (created_by) ve N:M users (event_attendees) ilişkili
 * @author Rumeysa Aydın
 */

import pool from '../database/connection.js';

class EventModel {
  constructor() {
    this.inMemoryEvents = [];
    this.nextId = 1;
    this.seedInitialData();
  }

  seedInitialData() {
    const seedData = [
      {
        title: 'Mezunlar ve Öğrenciler Buluşması 2026',
        description: 'Farklı sektörlerdeki mezunlarımızın katılımıyla kariyer paneli ve networking resepsiyonu.',
        event_date: '2026-11-15T14:00:00.000Z',
        location: 'Rektörlük Mavi Salon',
        capacity: 200,
        created_by: 3
      }
    ];

    seedData.forEach(e => this.createInMemory(e));
  }

  formatFromDb(row) {
    if (!row) return null;
    return {
      id: row.id,
      title: row.title,
      description: row.description || '',
      event_date: row.event_date ? new Date(row.event_date).toISOString() : null,
      location: row.location || '',
      capacity: row.capacity ? parseInt(row.capacity, 10) : 100,
      created_by: row.created_by ? parseInt(row.created_by, 10) : null,
      created_at: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : null
    };
  }

  async getAll(filters = {}) {
    try {
      let queryText = 'SELECT * FROM events WHERE 1=1';
      const params = [];

      if (filters.search) {
        params.push(`%${String(filters.search).toLowerCase().trim()}%`);
        queryText += ` AND (LOWER(title) LIKE $${params.length} OR LOWER(description) LIKE $${params.length} OR LOWER(location) LIKE $${params.length})`;
      }

      if (filters.created_by) {
        params.push(parseInt(filters.created_by, 10));
        queryText += ` AND created_by = $${params.length}`;
      }

      queryText += ' ORDER BY event_date ASC';

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
      const res = await pool.query('SELECT * FROM events WHERE id = $1', [numericId]);
      if (res.rows.length === 0) return null;
      return this.formatFromDb(res.rows[0]);
    } catch {
      const evt = this.inMemoryEvents.find(e => e.id === numericId);
      return evt ? { ...evt } : null;
    }
  }

  async getByCreatedBy(userId) {
    return this.getAll({ created_by: userId });
  }

  async create(data) {
    const {
      title,
      description = '',
      event_date,
      location = '',
      capacity = 100,
      created_by = null
    } = data;

    if (!title || !event_date) {
      throw new Error('title ve event_date alanları zorunludur.');
    }

    try {
      const res = await pool.query(
        `INSERT INTO events (title, description, event_date, location, capacity, created_by)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [title, description, event_date, location, capacity, created_by]
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
        description: partialData.description !== undefined ? partialData.description : existing.description,
        event_date: partialData.event_date !== undefined ? partialData.event_date : existing.event_date,
        location: partialData.location !== undefined ? partialData.location : existing.location,
        capacity: partialData.capacity !== undefined ? partialData.capacity : existing.capacity
      };

      const res = await pool.query(
        `UPDATE events SET
          title = $1, description = $2, event_date = $3, location = $4,
          capacity = $5, updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
        RETURNING *`,
        [updated.title, updated.description, updated.event_date, updated.location, updated.capacity, numericId]
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
      const res = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [numericId]);
      if (res.rows.length === 0) return null;
      return this.formatFromDb(res.rows[0]);
    } catch {
      return this.deleteInMemory(numericId);
    }
  }

  getAllInMemory(filters = {}) {
    let result = [...this.inMemoryEvents];

    if (filters.search) {
      const term = String(filters.search).toLowerCase().trim();
      result = result.filter(e =>
        (e.title && e.title.toLowerCase().includes(term)) ||
        (e.description && e.description.toLowerCase().includes(term)) ||
        (e.location && e.location.toLowerCase().includes(term))
      );
    }

    if (filters.created_by) {
      const cb = parseInt(filters.created_by, 10);
      result = result.filter(e => e.created_by === cb);
    }

    return result.sort((a, b) => new Date(a.event_date) - new Date(b.event_date)).map(e => ({ ...e }));
  }

  createInMemory(data) {
    const newEvent = {
      id: this.nextId++,
      title: data.title,
      description: data.description || '',
      event_date: data.event_date ? new Date(data.event_date).toISOString() : new Date().toISOString(),
      location: data.location || '',
      capacity: data.capacity !== undefined ? parseInt(data.capacity, 10) : 100,
      created_by: data.created_by ? parseInt(data.created_by, 10) : null,
      created_at: new Date().toISOString(),
      updated_at: null
    };

    this.inMemoryEvents.push(newEvent);
    return { ...newEvent };
  }

  updateInMemory(id, partialData) {
    const numericId = parseInt(id, 10);
    const evt = this.inMemoryEvents.find(e => e.id === numericId);
    if (!evt) return null;

    Object.assign(evt, partialData);
    evt.updated_at = new Date().toISOString();
    return { ...evt };
  }

  deleteInMemory(id) {
    const numericId = parseInt(id, 10);
    const index = this.inMemoryEvents.findIndex(e => e.id === numericId);
    if (index === -1) return null;
    const [deleted] = this.inMemoryEvents.splice(index, 1);
    return deleted;
  }

  reset() {
    this.inMemoryEvents = [];
    this.nextId = 1;
    this.seedInitialData();
  }
}

export const eventModel = new EventModel();
export default eventModel;
