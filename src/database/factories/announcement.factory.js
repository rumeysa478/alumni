/**
 * @file src/database/factories/announcement.factory.js
 * @description Demo / Mock Duyuru Verisi Üretim Fabrikası (AnnouncementFactory)
 */

const ANNOUNCEMENT_TEMPLATES = [
  {
    title: '🤝 Mezun-Öğrenci Kariyer Mentörlüğü Programı Başvuruları Açıldı',
    content: 'Farklı sektörlerde çalışan deneyimli mezunlarımızla bir araya gelerek kariyer yolculuğunuzu şekillendirebilirsiniz. Kontenjan sınırlıdır, başvurular bu ay sonuna kadar devam edecektir.',
    category: 'CAREER',
    author: 'Kariyer ve Mezunlar Koordinatörlüğü',
    target_audience: 'ALL'
  },
  {
    title: '🌐 Web ve Mobil Teknolojileri Hackathonu 2026',
    content: 'Üniversitemiz Mühendislik Fakültesi ev sahipliğinde gerçekleşecek 48 saatlik hackathonda büyük ödüller ve iş teklifleri sizleri bekliyor.',
    category: 'EVENT',
    author: 'Yazılım Kulübü & Bilişim Topluluğu',
    target_audience: 'STUDENT'
  },
  {
    title: '🎓 2026 Güz Dönemi Yüksek Lisans ve Doktora Bursları',
    content: 'Enstitümüz bünyesinde yürütülen araştırma projelerinde bursiyer olarak görev alacak mezun adaylar aranmaktadır. Ayrıntılı başvuru şartları için web sitemizi ziyaret edin.',
    category: 'ACADEMIC',
    author: 'Lisansüstü Eğitim Enstitüsü',
    target_audience: 'ALUMNI'
  },
  {
    title: '☕ Mezunlarla Kahve Sohbetleri: Yapay Zeka Çağında Yazılım',
    content: 'Silikon Vadisi ve Avrupa merkezli teknoloji şirketlerinde görev alan mezunlarımızla çevrimiçi soru-cevap ve networking buluşması gerçekleşecektir.',
    category: 'EVENT',
    author: 'Mezunlar İletişim Ofisi',
    target_audience: 'ALL'
  },
  {
    title: '💼 Partner Savunma Sanayii Firmalarında Uzun Dönem Aday Mühendislik',
    content: '3. ve 4. sınıf öğrencilerimizin haftada en az 2 gün tam zamanlı çalışabileceği Aday Mühendislik programına başvurular başlamıştır.',
    category: 'CAREER',
    author: 'Kariyer Gelişim Merkezi',
    target_audience: 'STUDENT'
  },
  {
    title: '📢 Kampüs İçi Kütüphane ve İnovasyon Merkezi Çalışma Saatleri',
    content: 'Vize ve final haftalarında kütüphanemiz 7/24 hizmet verecek, mezun kartı sahibi kullanıcılarımız da çalışma salonlarından faydalanabilecektir.',
    category: 'GENERAL',
    author: 'Kütüphane ve Dokümantasyon Dairesi',
    target_audience: 'ALL'
  }
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const AnnouncementFactory = {
  /**
   * Tekil bir duyuru mock veri objesi üretir
   * @param {Object} overrides Özel alan ezmeleri
   * @returns {Object}
   */
  definition(overrides = {}) {
    const template = getRandomItem(ANNOUNCEMENT_TEMPLATES);
    const randId = Math.floor(Math.random() * 1000);

    return {
      title: overrides.title || `${template.title} (#${randId})`,
      content: overrides.content || template.content,
      category: overrides.category || template.category,
      author: overrides.author || template.author,
      target_audience: overrides.target_audience || template.target_audience,
      is_active: overrides.is_active !== undefined ? overrides.is_active : true,
      ...overrides
    };
  },

  /**
   * Belirtilen adette duyuru mock verisi üretir
   * @param {number} count Üretilecek adet
   * @param {Object} overrides Özel alan ezmeleri
   * @returns {Array<Object>}
   */
  createMany(count = 5, overrides = {}) {
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push(this.definition(overrides));
    }
    return items;
  }
};

export default AnnouncementFactory;
