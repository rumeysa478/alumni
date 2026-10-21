/**
 * @file src/models/index.js
 * @description Merkezi Model Yöneticisi ve İlişki Tanımları (Models & Relations Registry)
 * @author Rumeysa Aydın
 */

import userModel from './user.model.js';
import alumniProfileModel from './alumniProfile.model.js';
import announcementModel from './announcement.model.js';
import jobPostingModel from './jobPosting.model.js';
import applicationModel, { APPLICATION_STATUS, VALID_STATUSES } from './application.model.js';
import eventModel from './event.model.js';
import eventAttendeeModel from './eventAttendee.model.js';
import mentorshipModel from './mentorship.model.js';

// Geriye dönük uyumluluk takma adı (Backward compatibility alias)
export const jobApplicationModel = applicationModel;

/**
 * 🌟 Sistem Varlık İlişkileri ve Kardinalite Tanımları (Metadata)
 * ddd.md Bölüm 4'e tam uyumlu E-R ilişkileri
 */
export const RELATIONS = {
  // 1. users tablosu ilişkileri
  User: {
    // 1 : 1 -> users <=> alumni_profiles (ON DELETE CASCADE)
    profile: {
      type: 'hasOne',
      cardinality: '1:1',
      model: 'AlumniProfile',
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
      description: 'Her kullanıcının en fazla bir mezun detay profili olabilir.'
    },
    // 1 : N -> users <=> job_postings (ON DELETE SET NULL)
    postedJobs: {
      type: 'hasMany',
      cardinality: '1:N',
      model: 'JobPosting',
      foreignKey: 'posted_by',
      onDelete: 'SET NULL',
      description: 'Kullanıcının sisteme eklediği iş ve staj ilanları.'
    },
    // 1 : N -> users <=> applications (ON DELETE CASCADE)
    applications: {
      type: 'hasMany',
      cardinality: '1:N',
      model: 'Application',
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
      description: 'Kullanıcının yaptığı tüm iş/staj başvuruları (Aksiyon tablosu).'
    },
    // N : M -> users <=> job_postings (applications üzerinden)
    appliedJobs: {
      type: 'belongsToMany',
      cardinality: 'N:M',
      model: 'JobPosting',
      through: 'Application',
      foreignKey: 'user_id',
      otherKey: 'job_id',
      onDelete: 'CASCADE',
      description: 'Kullanıcının başvurduğu iş ilanları.'
    },
    // 1 : N -> users <=> events (ON DELETE SET NULL)
    organizedEvents: {
      type: 'hasMany',
      cardinality: '1:N',
      model: 'Event',
      foreignKey: 'created_by',
      onDelete: 'SET NULL',
      description: 'Kullanıcının organizatör olarak açtığı etkinlikler.'
    },
    // N : M -> users <=> events (event_attendees üzerinden)
    attendedEvents: {
      type: 'belongsToMany',
      cardinality: 'N:M',
      model: 'Event',
      through: 'EventAttendee',
      foreignKey: 'user_id',
      otherKey: 'event_id',
      onDelete: 'CASCADE',
      description: 'Kullanıcının katılım sağladığı etkinlikler.'
    },
    // 1 : N -> users <=> mentorships (as mentor)
    mentorshipsAsMentor: {
      type: 'hasMany',
      cardinality: '1:N',
      model: 'Mentorship',
      foreignKey: 'mentor_id',
      onDelete: 'CASCADE',
      description: 'Kullanıcının mentör olduğu mentörlük ilişkileri.'
    },
    // 1 : N -> users <=> mentorships (as mentee)
    mentorshipsAsMentee: {
      type: 'hasMany',
      cardinality: '1:N',
      model: 'Mentorship',
      foreignKey: 'mentee_id',
      onDelete: 'CASCADE',
      description: 'Kullanıcının mentee (danışan) olduğu mentörlük ilişkileri.'
    }
  },

  // 2. alumni_profiles tablosu ilişkileri
  AlumniProfile: {
    user: {
      type: 'belongsTo',
      cardinality: '1:1',
      model: 'User',
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
      description: 'Profilin ait olduğu ana kullanıcı hesabı.'
    }
  },

  // 3. job_postings tablosu ilişkileri
  JobPosting: {
    poster: {
      type: 'belongsTo',
      cardinality: '1:N',
      model: 'User',
      foreignKey: 'posted_by',
      onDelete: 'SET NULL',
      description: 'İlanı oluşturan kullanıcı / mezun.'
    },
    applications: {
      type: 'hasMany',
      cardinality: '1:N',
      model: 'Application',
      foreignKey: 'job_id',
      onDelete: 'CASCADE',
      description: 'Bu ilana gelen tüm başvurular (Aksiyon tablosu).'
    },
    applicants: {
      type: 'belongsToMany',
      cardinality: 'N:M',
      model: 'User',
      through: 'Application',
      foreignKey: 'job_id',
      otherKey: 'user_id',
      onDelete: 'CASCADE',
      description: 'Bu ilana başvuran tüm kullanıcılar.'
    }
  },

  // 4. applications tablosu (N:M Action Table / Associative Entity) ilişkileri
  Application: {
    job: {
      type: 'belongsTo',
      cardinality: '1:N',
      model: 'JobPosting',
      foreignKey: 'job_id',
      onDelete: 'CASCADE',
      description: 'Başvurulan iş ilanı.'
    },
    applicant: {
      type: 'belongsTo',
      cardinality: '1:N',
      model: 'User',
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
      description: 'Başvuruyu yapan aday kullanıcı.'
    }
  },
  // Geriye dönük uyumluluk takma adı
  JobApplication: {
    job: {
      type: 'belongsTo',
      cardinality: '1:N',
      model: 'JobPosting',
      foreignKey: 'job_id',
      onDelete: 'CASCADE'
    },
    applicant: {
      type: 'belongsTo',
      cardinality: '1:N',
      model: 'User',
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    }
  },

  // 5. events tablosu ilişkileri
  Event: {
    organizer: {
      type: 'belongsTo',
      cardinality: '1:N',
      model: 'User',
      foreignKey: 'created_by',
      onDelete: 'SET NULL',
      description: 'Etkinliği oluşturan organizatör.'
    },
    attendees: {
      type: 'hasMany',
      cardinality: '1:N',
      model: 'EventAttendee',
      foreignKey: 'event_id',
      onDelete: 'CASCADE',
      description: 'Etkinliğe yapılan kayıt listesi.'
    },
    participants: {
      type: 'belongsToMany',
      cardinality: 'N:M',
      model: 'User',
      through: 'EventAttendee',
      foreignKey: 'event_id',
      otherKey: 'user_id',
      onDelete: 'CASCADE',
      description: 'Etkinliğe katılan kullanıcılar.'
    }
  },

  // 6. event_attendees tablosu (Köprü / Pivot) ilişkileri
  EventAttendee: {
    event: {
      type: 'belongsTo',
      cardinality: '1:N',
      model: 'Event',
      foreignKey: 'event_id',
      onDelete: 'CASCADE'
    },
    user: {
      type: 'belongsTo',
      cardinality: '1:N',
      model: 'User',
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    }
  },

  // 7. mentorships tablosu ilişkileri
  Mentorship: {
    mentor: {
      type: 'belongsTo',
      cardinality: '1:N',
      model: 'User',
      foreignKey: 'mentor_id',
      onDelete: 'CASCADE',
      description: 'Mentörlük veren mezun.'
    },
    mentee: {
      type: 'belongsTo',
      cardinality: '1:N',
      model: 'User',
      foreignKey: 'mentee_id',
      onDelete: 'CASCADE',
      description: 'Mentörlük alan öğrenci / mezun.'
    }
  }
};

/**
 * 🔗 Modeller Arası İlişkisel Yükleme (Relational Loader) Metotları
 * DAO/ActiveRecord katmanına ilişkisel sorgulama yeteneği kazandırır.
 */

// User Model İlişki Metotları
userModel.getProfile = async function (userId) {
  return alumniProfileModel.getByUserId(userId);
};

userModel.getJobPostings = async function (userId) {
  return jobPostingModel.getByPostedBy(userId);
};

userModel.getApplications = async function (userId) {
  return applicationModel.getByUserId(userId);
};

userModel.getAppliedJobs = async function (userId) {
  const applications = await applicationModel.getByUserId(userId);
  const jobs = [];
  for (const app of applications) {
    const job = await jobPostingModel.getById(app.job_id);
    if (job) jobs.push({ ...job, application: app });
  }
  return jobs;
};

userModel.getEvents = async function (userId) {
  return eventModel.getByCreatedBy(userId);
};

userModel.getAttendedEvents = async function (userId) {
  const attendees = await eventAttendeeModel.getByUserId(userId);
  const events = [];
  for (const att of attendees) {
    const evt = await eventModel.getById(att.event_id);
    if (evt) events.push({ ...evt, attendance: att });
  }
  return events;
};

userModel.getMentorships = async function (userId) {
  return mentorshipModel.getByUser(userId);
};

// AlumniProfile Model İlişki Metotları
alumniProfileModel.getUser = async function (userId) {
  return userModel.getById(userId);
};

// JobPosting Model İlişki Metotları
jobPostingModel.getPoster = async function (jobId) {
  const job = await this.getById(jobId);
  if (!job || !job.posted_by) return null;
  return userModel.getById(job.posted_by);
};

jobPostingModel.getApplications = async function (jobId) {
  return applicationModel.getByJobId(jobId);
};

jobPostingModel.getApplicants = async function (jobId) {
  const applications = await applicationModel.getByJobId(jobId);
  const users = [];
  for (const app of applications) {
    const user = await userModel.getById(app.user_id);
    if (user) users.push({ ...user, application: app });
  }
  return users;
};

// Application Model İlişki Metotları
applicationModel.getJob = async function (applicationId) {
  const app = await this.getById(applicationId);
  if (!app) return null;
  return jobPostingModel.getById(app.job_id);
};

applicationModel.getUser = async function (applicationId) {
  const app = await this.getById(applicationId);
  if (!app) return null;
  return userModel.getById(app.user_id);
};

applicationModel.getJobWithPoster = async function (applicationId) {
  const app = await this.getById(applicationId);
  if (!app) return null;
  const job = await jobPostingModel.getById(app.job_id);
  if (!job) return null;
  let poster = null;
  if (job.posted_by) {
    poster = await userModel.getById(job.posted_by);
  }
  return { ...job, poster };
};

// Event Model İlişki Metotları
eventModel.getCreator = async function (eventId) {
  const evt = await this.getById(eventId);
  if (!evt || !evt.created_by) return null;
  return userModel.getById(evt.created_by);
};

eventModel.getAttendees = async function (eventId) {
  return eventAttendeeModel.getByEventId(eventId);
};

eventModel.getParticipants = async function (eventId) {
  const attendees = await eventAttendeeModel.getByEventId(eventId);
  const users = [];
  for (const att of attendees) {
    const user = await userModel.getById(att.user_id);
    if (user) users.push({ ...user, attendance: att });
  }
  return users;
};

// EventAttendee Model İlişki Metotları
eventAttendeeModel.getEvent = async function (attendeeId) {
  const att = await this.getById(attendeeId);
  if (!att) return null;
  return eventModel.getById(att.event_id);
};

eventAttendeeModel.getUser = async function (attendeeId) {
  const att = await this.getById(attendeeId);
  if (!att) return null;
  return userModel.getById(att.user_id);
};

// Mentorship Model İlişki Metotları
mentorshipModel.getMentor = async function (mentorshipId) {
  const m = await this.getById(mentorshipId);
  if (!m) return null;
  return userModel.getById(m.mentor_id);
};

mentorshipModel.getMentee = async function (mentorshipId) {
  const m = await this.getById(mentorshipId);
  if (!m) return null;
  return userModel.getById(m.mentee_id);
};

/**
 * Toplu Modeller Sözlüğü
 */
export const models = {
  User: userModel,
  AlumniProfile: alumniProfileModel,
  Announcement: announcementModel,
  JobPosting: jobPostingModel,
  Application: applicationModel,
  JobApplication: applicationModel,
  Event: eventModel,
  EventAttendee: eventAttendeeModel,
  Mentorship: mentorshipModel
};

export {
  userModel,
  alumniProfileModel,
  announcementModel,
  jobPostingModel,
  applicationModel,
  eventModel,
  eventAttendeeModel,
  mentorshipModel,
  APPLICATION_STATUS,
  VALID_STATUSES
};

export default models;
