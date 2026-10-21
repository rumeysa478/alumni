/**
 * @file src/database/factories/job.factory.js
 * @description Demo / Mock İş ve Staj İlanı Verisi Üretim Fabrikası (JobPostingFactory)
 */

const JOB_TITLES = [
  { title: 'Junior Frontend Developer (React/Vue)', level: 'JUNIOR', type: 'FULL_TIME', sector: 'Yazılım & Bilişim', min: 45000, max: 65000 },
  { title: 'Backend Developer (Node.js & PostgreSQL)', level: 'MID', type: 'FULL_TIME', sector: 'Yazılım & Bilişim', min: 70000, max: 95000 },
  { title: 'Senior Full Stack Software Engineer', level: 'SENIOR', type: 'FULL_TIME', sector: 'Yazılım & Bilişim', min: 110000, max: 150000 },
  { title: 'DevOps & Cloud Engineer (AWS / Kubernetes)', level: 'MID', type: 'FULL_TIME', sector: 'Telekomünikasyon', min: 80000, max: 110000 },
  { title: 'Yazılım Geliştirme Stajyeri', level: 'INTERN', type: 'INTERNSHIP', sector: 'Yazılım & Bilişim', min: 18500, max: 23000 },
  { title: 'Veri Analitiği ve İş Zekası Stajyeri', level: 'INTERN', type: 'INTERNSHIP', sector: 'Finans & Bankacılık', min: 19000, max: 24000 },
  { title: 'Mobile Developer (Flutter / React Native)', level: 'JUNIOR', type: 'FULL_TIME', sector: 'E-Ticaret & Perakende', min: 50000, max: 70000 },
  { title: 'Cyber Security Operations Analyst', level: 'MID', type: 'FULL_TIME', sector: 'Siber Güvenlik', min: 75000, max: 105000 },
  { title: 'Savunma Sistemleri Gömülü Yazılım Mühendisi', level: 'MID', type: 'FULL_TIME', sector: 'Savunma Sanayii', min: 85000, max: 120000 }
];

const COMPANIES = [
  { name: 'Trendyol Tech', slug: 'trendyol' },
  { name: 'Getir Tech', slug: 'getir' },
  { name: 'Aselsan', slug: 'aselsan' },
  { name: 'Havelsan', slug: 'havelsan' },
  { name: 'Softtech', slug: 'softtech' },
  { name: 'Garanti BBVA Teknoloji', slug: 'garantibbva' },
  { name: 'Hepsiburada Tech', slug: 'hepsiburada' },
  { name: 'Insider', slug: 'insider' },
  { name: 'Peak Games', slug: 'peak' },
  { name: 'Baykar Teknoloji', slug: 'baykar' }
];

const LOCATIONS = ['İstanbul (Maslak)', 'Ankara (ODTÜ Teknokent)', 'İzmir (Alsancak)', 'Uzaktan / Remote', 'Hibrit (Levent / İstanbul)'];
const WORK_MODELS = ['ONSITE', 'HYBRID', 'REMOTE'];

const REQUIREMENTS_BY_LEVEL = {
  INTERN: '• Üniversitelerin Bilgisayar/Yazılım/YBS veya ilgili mühendislik bölümlerinde 3. veya 4. sınıf öğrencisi olmak\n• Temel algoritma ve veri yapıları bilgisi\n• Git/GitHub versiyon kontrol sistemlerine aşinalık\n• Haftada en az 3 gün devam edebilme',
  ENTRY_LEVEL: '• İlgili lisans bölümlerinden yeni mezun veya 0-1 yıl deneyim\n• Temel web teknolojileri veya programlama dili bilgisi\n• Analitik düşünme ve problem çözme becerisi\n• Takım çalışmasına ve çevik (Agile/Scrum) süreçlere uyum',
  JUNIOR: '• 1-2 yıl benzer pozisyonda yazılım geliştirme tecrübesi\n• Modern frameworkler (React, Node.js veya modern diller) ile proje tecrübesi\n• İlişkisel veritabanı (PostgreSQL / MySQL) ve REST API tasarımı bilgisi\n• Temel CI/CD ve test yazımı kültürü',
  MID: '• 3-5 yıl profesyonel yazılım geliştirme deneyimi\n• Ölçeklenebilir mikroservis mimarileri ve yüksek trafikli sistemler tecrübesi\n• PostgreSQL, Redis ve mesaj kuyrukları (RabbitMQ/Kafka) deneyimi\n• Kod inceleme (Code Review) süreçlerine liderlik edebilme',
  SENIOR: '• 5+ yıl sektör tecrübesi ve karmaşık sistem mimarisi tasarlama yetkinliği\n• Bulut bilişim (AWS, GCP veya Azure) ve konteynerizasyon (Docker/Kubernetes)\n• Junior ve Mid-level mühendislere mentorluk yapabilme\n• Güvenli kodlama ve performans optimizasyonu standartlarına hakimiyet',
  LEAD: '• 7+ yıl deneyim ve teknik ekip liderliği geçmişi\n• Ürün ve mühendislik vizyonunu iş hedefleriyle buluşturma yetkinliği'
};

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const JobPostingFactory = {
  definition(overrides = {}) {
    const jobTemplate = getRandomItem(JOB_TITLES);
    const companyObj = getRandomItem(COMPANIES);

    const title = overrides.title || jobTemplate.title;
    const company = overrides.company || companyObj.name;
    const experience_level = overrides.experience_level || jobTemplate.level;
    const type = overrides.type || jobTemplate.type;
    const sector = overrides.sector || jobTemplate.sector;
    const work_model = overrides.work_model || getRandomItem(WORK_MODELS);
    const requirements = overrides.requirements || (REQUIREMENTS_BY_LEVEL[experience_level] || REQUIREMENTS_BY_LEVEL.MID);
    const futureDate = new Date(Date.now() + getRandomInt(15, 60) * 24 * 60 * 60 * 1000).toISOString();
    const location = overrides.location || getRandomItem(LOCATIONS);

    const salary_min = overrides.salary_min !== undefined ? overrides.salary_min : jobTemplate.min;
    const salary_max = overrides.salary_max !== undefined ? overrides.salary_max : jobTemplate.max;
    const companySlug = companyObj.slug || 'company';
    const application_url = overrides.application_url || `https://careers.${companySlug}.com/jobs/${getRandomInt(1000, 9999)}`;
    const contact_email = overrides.contact_email || `talent@${companySlug}.com`;
    const view_count = overrides.view_count !== undefined ? overrides.view_count : getRandomInt(25, 450);

    return {
      title,
      company,
      description: `${company} bünyesinde büyüyen mühendislik ve ürün ekibimize katılacak, yenilikçi projelere katkı sağlayacak ${title} arayışımız bulunmaktadır. Takım çalışmasına yatkın, öğrenmeye istekli ve dinamik adayların başvurularını bekliyoruz.`,
      requirements,
      location,
      work_model,
      type,
      experience_level,
      sector,
      salary_min,
      salary_max,
      currency: overrides.currency || 'TRY',
      application_url,
      contact_email,
      deadline: futureDate,
      posted_by: overrides.posted_by || 1,
      is_active: true,
      view_count,
      ...overrides
    };
  },

  createMany(count = 5, overrides = {}) {
    const jobs = [];
    for (let i = 0; i < count; i++) {
      jobs.push(this.definition(overrides));
    }
    return jobs;
  }
};

export default JobPostingFactory;
