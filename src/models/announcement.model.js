/**
 * @file src/models/announcement.model.js
 * @description In-memory Announcement Model for Alumni Tracking System (Veritabanı bağlantısı olmadan CRUD işlevleri)
 */

const VALID_CATEGORIES = ['EVENT', 'CAREER', 'ACADEMIC', 'GENERAL'];
const VALID_AUDIENCES = ['ALL', 'ALUMNI', 'STUDENT'];

class AnnouncementModel {
  constructor() {
    this.announcements = [];
    this.nextId = 1;
    this.seedInitialData();
  }

  /**
   * Başlangıç duyuru örnek verilerini yükler
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

    seedData.forEach(item => this.create(item));
  }

  /**
   * Tüm duyuruları listeler (arama ve filtreleme destekli)
   * @param {Object} filters
   * @returns {Array}
   */
  getAll(filters = {}) {
    let result = [...this.announcements];

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
      const activeBool = Boolean(filters.is_active === true || filters.is_active === 'true');
      result = result.filter(a => a.is_active === activeBool);
    }

    // En yeni duyurular başta gelsin
    return result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  /**
   * ID ile tekil duyuru bulur
   * @param {number|string} id
   * @returns {Object|null}
   */
  getById(id) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;
    return this.announcements.find(a => a.id === numericId) || null;
  }

  /**
   * Yeni duyuru oluşturur (Create - C)
   * @param {Object} data
   * @returns {Object}
   */
  create(data) {
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

    this.announcements.push(newAnnouncement);
    return newAnnouncement;
  }

  /**
   * Duyuruyu tam günceller (Update - U)
   * @param {number|string} id
   * @param {Object} updateData
   * @returns {Object|null}
   */
  update(id, updateData) {
    const announcement = this.getById(id);
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

  /**
   * Duyuruyu kısmi günceller (Patch - U)
   * @param {number|string} id
   * @param {Object} partialData
   * @returns {Object|null}
   */
  patch(id, partialData) {
    const announcement = this.getById(id);
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
      if (!String(title).trim()) throw new Error('Duyuru başlığı boş olamaz.');
      announcement.title = String(title).trim();
    }

    if (content !== undefined) {
      if (!String(content).trim()) throw new Error('Duyuru içeriği boş olamaz.');
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

  /**
   * Duyuruyu siler (Delete - D)
   * @param {number|string} id
   * @returns {Object|null}
   */
  delete(id) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;

    const index = this.announcements.findIndex(a => a.id === numericId);
    if (index === -1) return null;

    const [deleted] = this.announcements.splice(index, 1);
    return deleted;
  }

  /**
   * Verileri sıfırlar
   */
  reset() {
    this.announcements = [];
    this.nextId = 1;
    this.seedInitialData();
  }
}

export const announcementModel = new AnnouncementModel();
export default announcementModel;
