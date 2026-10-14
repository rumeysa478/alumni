/**
 * @file src/database/factories/user.factory.js
 * @description Demo / Mock Kullanıcı Verisi Üretim Fabrikası (UserFactory)
 */

const FIRST_NAMES = [
  'Emre', 'Burak', 'Can', 'Deniz', 'Mert', 'Kaan', 'Tolga', 'Barış', 'Alper', 'Oğuz',
  'Elif', 'Seda', 'Büşra', 'Demet', 'Gamze', 'İrem', 'Ece', 'Selin', 'Melis', 'Ezgi',
  'Ahmet', 'Mehmet', 'Ali', 'Mustafa', 'Zeynep', 'Ayşe', 'Fatma', 'Rumeysa', 'Hakan'
];

const LAST_NAMES = [
  'Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Yıldız', 'Yıldırım', 'Öztürk', 'Aydın',
  'Özdemir', 'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Çetin', 'Kara', 'Koç', 'Kurt', 'Özkan', 'Şimşek'
];

const DEPARTMENTS = [
  'Yönetim Bilişim Sistemleri',
  'Bilgisayar Mühendisliği',
  'Yazılım Mühendisliği',
  'Endüstri Mühendisliği',
  'Elektrik-Elektronik Mühendisliği',
  'Yapay Zeka ve Veri Mühendisliği',
  'İşletme',
  'İktisat'
];

const COMPANIES = [
  'Trendyol', 'Getir', 'Aselsan', 'Havelsan', 'Baykar', 'Turkcell', 'Softtech',
  'Garanti BBVA Teknoloji', 'Akbank Teknoloji', 'Hepsiburada', 'Insider', 'Peak Games',
  'Amazon Web Services', 'Google Cloud', 'Microsoft'
];

const TITLES = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'DevOps Engineer', 'Cloud Solutions Architect', 'Data Scientist',
  'Product Manager', 'Cyber Security Specialist', 'Mobile App Developer'
];

const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Kocaeli', 'Eskişehir', 'Londra', 'Berlin', 'Amsterdam'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const UserFactory = {
  /**
   * Tekil bir kullanıcı mock veri objesi üretir
   * @param {Object} overrides Özel alan ezmeleri
   * @returns {Object}
   */
  definition(overrides = {}) {
    const firstName = overrides.first_name || getRandomItem(FIRST_NAMES);
    const lastName = overrides.last_name || getRandomItem(LAST_NAMES);
    const randNum = getRandomInt(100, 999);
    
    // Türkçe karakterleri basitçe slug yap
    const emailPrefix = `${firstName.toLowerCase().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')}.${lastName.toLowerCase().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')}${randNum}`;
    
    const role = overrides.role || (Math.random() > 0.3 ? 'ALUMNI' : 'STUDENT');
    const gradYear = role === 'STUDENT' ? getRandomInt(2025, 2028) : getRandomInt(2012, 2024);

    return {
      email: `${emailPrefix}@alumni.edu`,
      password: 'password123',
      first_name: firstName,
      last_name: lastName,
      role,
      department: overrides.department || getRandomItem(DEPARTMENTS),
      graduation_year: gradYear,
      is_verified: true,
      // Profil genişletmeleri (1:1 tablo için)
      profile: {
        current_company: role === 'ALUMNI' ? getRandomItem(COMPANIES) : null,
        current_title: role === 'ALUMNI' ? getRandomItem(TITLES) : 'Öğrenci / Stajyer',
        city: getRandomItem(CITIES),
        country: 'Türkiye',
        linkedin_url: `https://linkedin.com/in/${emailPrefix}`,
        github_url: `https://github.com/${emailPrefix}`
      },
      ...overrides
    };
  },

  /**
   * Belirtilen adette kullanıcı mock verisi üretir
   * @param {number} count Üretilecek adet
   * @param {Object} overrides Özel alan ezmeleri
   * @returns {Array<Object>}
   */
  createMany(count = 10, overrides = {}) {
    const users = [];
    for (let i = 0; i < count; i++) {
      users.push(this.definition(overrides));
    }
    return users;
  }
};

export default UserFactory;
