/**
 * @file src/database/factories/job.factory.js
 * @description Demo / Mock İş ve Staj İlanı Verisi Üretim Fabrikası (JobPostingFactory)
 */

const JOB_TITLES = [
  'Junior Frontend Developer (React/Vue)',
  'Backend Developer (Node.js & PostgreSQL)',
  'Full Stack Software Engineer',
  'DevOps & Cloud Engineer',
  'Yazılım Geliştirme Stajyeri',
  'Veri Analitiği ve İş Zekası Stajyeri',
  'Mobile Developer (Flutter / React Native)',
  'Cyber Security Analyst'
];

const COMPANIES = [
  'Trendyol Tech', 'Getir', 'Aselsan', 'Havelsan', 'Softtech',
  'Garanti BBVA', 'Hepsiburada', 'Insider', 'Peak Games', 'Baykar Teknoloji'
];

const LOCATIONS = ['İstanbul (Maslak)', 'Ankara (ODTÜ Teknokent)', 'İzmir', 'Uzaktan / Remote', 'Hibrit (İstanbul)'];
const TYPES = ['FULL_TIME', 'INTERNSHIP', 'PART_TIME', 'REMOTE'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const JobPostingFactory = {
  definition(overrides = {}) {
    const title = overrides.title || getRandomItem(JOB_TITLES);
    const company = overrides.company || getRandomItem(COMPANIES);
    const type = overrides.type || (title.includes('Staj') ? 'INTERNSHIP' : getRandomItem(TYPES));
    const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    return {
      title,
      company,
      description: `${company} bünyesinde büyüyen mühendislik ekibimize katılacak, yenilikçi projelere katkı sağlayacak ${title} arayışımız bulunmaktadır. Takım çalışmasına yatkın, öğrenmeye istekli adayların başvurularını bekliyoruz.`,
      location: overrides.location || getRandomItem(LOCATIONS),
      type,
      deadline: futureDate,
      posted_by: overrides.posted_by || 1,
      is_active: true,
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
