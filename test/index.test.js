import test from 'node:test';
import assert from 'node:assert';
import app from '../index.js';

test('GET / returns temporary home page HTML and status 200', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const res = await fetch(`http://127.0.0.1:${port}/`, {
      headers: { Accept: 'text/html' }
    });
    assert.strictEqual(res.status, 200);
    const body = await res.text();
    assert.ok(body.includes('Alumni Tracking System'));
    assert.ok(body.includes('temporary home page'));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('GET /about returns about page HTML and status 200', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const res = await fetch(`http://127.0.0.1:${port}/about`);
    assert.strictEqual(res.status, 200);
    const body = await res.text();
    assert.ok(body.includes('About This Project'));
    assert.ok(body.includes('Alumni Tracking System'));
    assert.ok(body.includes('Tech Stack'));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('GET /hello returns Hello World and status 200', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const res = await fetch(`http://127.0.0.1:${port}/hello`);
    assert.strictEqual(res.status, 200);
    const body = await res.text();
    assert.strictEqual(body, 'Hello World');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('GET /hello/:name returns Hello <Name>! and status 200', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const res1 = await fetch(`http://127.0.0.1:${port}/hello/rumeysa`);
    assert.strictEqual(res1.status, 200);
    const body1 = await res1.text();
    assert.strictEqual(body1, 'Hello Rumeysa!');

    const res2 = await fetch(`http://127.0.0.1:${port}/hello/emre`);
    assert.strictEqual(res2.status, 200);
    const body2 = await res2.text();
    assert.strictEqual(body2, 'Hello Emre!');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('GET /sum/:number1/:number2 returns toplam= <sum> and status 200', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const res1 = await fetch(`http://127.0.0.1:${port}/sum/3/5`);
    assert.strictEqual(res1.status, 200);
    const body1 = await res1.text();
    assert.strictEqual(body1, 'toplam= 8');

    const res2 = await fetch(`http://127.0.0.1:${port}/sum/15/25`);
    assert.strictEqual(res2.status, 200);
    const body2 = await res2.text();
    assert.strictEqual(body2, 'toplam= 40');

    const res3 = await fetch(`http://127.0.0.1:${port}/sum/abc/5`);
    assert.strictEqual(res3.status, 400);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

// ==========================================
// MVC VIEW LAYER TESTS (/users)
// ==========================================

test('GET /users returns user listings HTML and status 200 (Read - R)', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const res = await fetch(`http://127.0.0.1:${port}/users`);
    assert.strictEqual(res.status, 200);
    const body = await res.text();
    assert.ok(body.includes('Mezun ve Öğrenci Listesi'));
    assert.ok(body.includes('Rumeysa') || body.includes('Rümeysa'));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('GET /users/new returns create user form HTML and status 200', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const res = await fetch(`http://127.0.0.1:${port}/users/new`);
    assert.strictEqual(res.status, 200);
    const body = await res.text();
    assert.ok(body.includes('Yeni Kullanıcı Kaydı'));
    assert.ok(body.includes('form action="/users" method="POST"'));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('POST /users creates new user via form and redirects (Create - C)', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const formData = new URLSearchParams({
      first_name: 'Test',
      last_name: 'User',
      email: 'test.mvc@alumni.edu',
      password: 'password123',
      role: 'ALUMNI',
      department: 'Yazılım',
      graduation_year: '2025'
    });

    const res = await fetch(`http://127.0.0.1:${port}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
      redirect: 'manual'
    });

    // Should redirect (302) to /users
    assert.strictEqual(res.status, 302);
    assert.ok(res.headers.get('location').includes('/users'));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('GET /users/:id returns user detail HTML (Read - R)', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const res = await fetch(`http://127.0.0.1:${port}/users/1`);
    assert.strictEqual(res.status, 200);
    const body = await res.text();
    assert.ok(body.includes('Profil'));
    assert.ok(body.includes('Rumeysa') || body.includes('Rümeysa'));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('GET /users/:id/edit returns edit form HTML', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const res = await fetch(`http://127.0.0.1:${port}/users/1/edit`);
    assert.strictEqual(res.status, 200);
    const body = await res.text();
    assert.ok(body.includes('Bilgilerini Düzenle'));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('POST /users/:id updates user via form and redirects (Update - U)', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const formData = new URLSearchParams({
      first_name: 'Rumeysa',
      last_name: 'Aydın Güncel',
      email: 'rumeysa.aydin@alumni.edu',
      role: 'ALUMNI',
      department: 'YBS'
    });

    const res = await fetch(`http://127.0.0.1:${port}/users/1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
      redirect: 'manual'
    });

    assert.strictEqual(res.status, 302);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('POST /users/:id/delete removes user and redirects (Delete - D)', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    // Önce silinecek bir kullanıcı oluşturalım
    const createRes = await fetch(`http://127.0.0.1:${port}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'to_delete@alumni.edu',
        password: 'pass',
        first_name: 'DeleteMe',
        role: 'STUDENT'
      })
    });
    const createdData = await createRes.json();
    const deleteId = createdData.data.id;

    const res = await fetch(`http://127.0.0.1:${port}/users/${deleteId}/delete`, {
      method: 'POST',
      redirect: 'manual'
    });

    assert.strictEqual(res.status, 302);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

// ==========================================
// REST API LAYER TESTS (/api/users)
// ==========================================

test('GET /api/users returns JSON users list and 200 OK', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/users`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(Array.isArray(body.data));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('POST /api/users creates user and returns 201 Created', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'api.user@alumni.edu',
        password: 'secretPassword',
        first_name: 'API',
        last_name: 'Kullanıcı',
        role: 'ALUMNI',
        department: 'Bilgisayar',
        graduation_year: 2024
      })
    });

    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.email, 'api.user@alumni.edu');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('GET /api/users/:id returns user by id', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/users/1`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.id, 1);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('PUT /api/users/:id updates user', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/users/1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'Rumeysa',
        last_name: 'Aydın',
        department: 'Yönetim Bilişim Sistemleri (Updated)'
      })
    });

    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('DELETE /api/users/:id removes user', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const createRes = await fetch(`http://127.0.0.1:${port}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'api.delete@alumni.edu',
        password: 'pass',
        role: 'STUDENT'
      })
    });
    const created = await createRes.json();
    const deleteId = created.data.id;

    const res = await fetch(`http://127.0.0.1:${port}/api/users/${deleteId}`, {
      method: 'DELETE'
    });

    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

// ==========================================
// SWAGGER DOCS TESTS
// ==========================================

test('GET /api/swagger.json returns OpenAPI spec with users and announcements', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/swagger.json`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.openapi, '3.0.0');
    assert.ok(body.paths['/users']);
    assert.ok(body.paths['/api/users']);
    assert.ok(body.paths['/announcements']);
    assert.ok(body.paths['/api/announcements']);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

// ==========================================
// ANNOUNCEMENT MVC VIEW TESTS (/announcements)
// ==========================================

test('GET /announcements returns announcements list HTML and status 200 (Read - R)', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const res = await fetch(`http://127.0.0.1:${port}/announcements`);
    assert.strictEqual(res.status, 200);
    const body = await res.text();
    assert.ok(body.includes('Duyurular ve Etkinlikler'));
    assert.ok(body.includes('Mezunlar Günü'));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('GET /announcements/new returns create announcement form HTML', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const res = await fetch(`http://127.0.0.1:${port}/announcements/new`);
    assert.strictEqual(res.status, 200);
    const body = await res.text();
    assert.ok(body.includes('Yeni Duyuru Oluştur'));
    assert.ok(body.includes('form action="/announcements" method="POST"'));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('POST /announcements creates announcement via form and redirects (Create - C)', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const formData = new URLSearchParams({
      title: 'Test Web Duyurusu',
      content: 'Bu bir test duyuru metnidir.',
      category: 'EVENT',
      author: 'Test Kulübü',
      target_audience: 'ALL',
      is_active: 'on'
    });

    const res = await fetch(`http://127.0.0.1:${port}/announcements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
      redirect: 'manual'
    });

    assert.strictEqual(res.status, 302);
    assert.ok(res.headers.get('location').includes('/announcements'));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('GET /announcements/:id returns announcement detail HTML (Read - R)', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const res = await fetch(`http://127.0.0.1:${port}/announcements/1`);
    assert.strictEqual(res.status, 200);
    const body = await res.text();
    assert.ok(body.includes('Duyuru Detayı'));
    assert.ok(body.includes('Mezunlar Günü'));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('GET /announcements/:id/edit returns edit form HTML', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const res = await fetch(`http://127.0.0.1:${port}/announcements/1/edit`);
    assert.strictEqual(res.status, 200);
    const body = await res.text();
    assert.ok(body.includes('Duyuru Bilgilerini Düzenle'));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('POST /announcements/:id updates announcement via form and redirects (Update - U)', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const formData = new URLSearchParams({
      title: '2026 Mezunlar Günü (Güncellendi)',
      content: 'Güncel saat bilgisi eklenmiştir.',
      category: 'EVENT',
      author: 'Mezunlar Derneği'
    });

    const res = await fetch(`http://127.0.0.1:${port}/announcements/1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
      redirect: 'manual'
    });

    assert.strictEqual(res.status, 302);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('POST /announcements/:id/delete removes announcement and redirects (Delete - D)', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const createRes = await fetch(`http://127.0.0.1:${port}/api/announcements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Silinecek Duyuru',
        content: 'Silinecek içerik',
        category: 'GENERAL'
      })
    });
    const created = await createRes.json();
    const deleteId = created.data.id;

    const res = await fetch(`http://127.0.0.1:${port}/announcements/${deleteId}/delete`, {
      method: 'POST',
      redirect: 'manual'
    });

    assert.strictEqual(res.status, 302);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

// ==========================================
// ANNOUNCEMENT REST API TESTS (/api/announcements)
// ==========================================

test('GET /api/announcements returns JSON list and 200 OK', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/announcements`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(Array.isArray(body.data));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('POST /api/announcements creates announcement and returns 201 Created', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/announcements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'API ile Eklenen Duyuru',
        content: 'Bu duyuru REST API üzerinden oluşturulmuştur.',
        category: 'CAREER',
        author: 'API Test',
        target_audience: 'STUDENT'
      })
    });

    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.title, 'API ile Eklenen Duyuru');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('GET /api/announcements/:id returns announcement by ID', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/announcements/1`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.id, 1);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('PUT /api/announcements/:id updates announcement', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/announcements/1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: '2026 Mezunlar Günü (API PUT Güncellendi)',
        content: 'Yeni içerik detayı...',
        category: 'EVENT'
      })
    });

    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('DELETE /api/announcements/:id removes announcement', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const createRes = await fetch(`http://127.0.0.1:${port}/api/announcements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'API Silinecek Duyuru',
        content: 'Silinecek içerik',
        category: 'GENERAL'
      })
    });
    const created = await createRes.json();
    const deleteId = created.data.id;

    const res = await fetch(`http://127.0.0.1:${port}/api/announcements/${deleteId}`, {
      method: 'DELETE'
    });

    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

// ==========================================
// FACTORY & SEED UNIT TESTS
// ==========================================

import { UserFactory, AnnouncementFactory, JobPostingFactory } from '../src/database/factories/index.js';

test('UserFactory produces realistic users and bulk objects', () => {
  const single = UserFactory.definition();
  assert.ok(single.email.includes('@alumni.edu'));
  assert.ok(['ALUMNI', 'STUDENT', 'ADMIN'].includes(single.role));
  assert.ok(single.profile.city);

  const bulk = UserFactory.createMany(5);
  assert.strictEqual(bulk.length, 5);
  assert.strictEqual(typeof bulk[0].first_name, 'string');
});

test('AnnouncementFactory produces valid category templates', () => {
  const single = AnnouncementFactory.definition();
  assert.ok(single.title.length > 0);
  assert.ok(['EVENT', 'CAREER', 'ACADEMIC', 'GENERAL'].includes(single.category));

  const bulk = AnnouncementFactory.createMany(4);
  assert.strictEqual(bulk.length, 4);
});

test('JobPostingFactory produces valid job postings', () => {
  const single = JobPostingFactory.definition();
  assert.ok(single.title.length > 0);
  assert.ok(single.company.length > 0);
  assert.ok(['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'REMOTE', 'CONTRACT'].includes(single.type));

  const bulk = JobPostingFactory.createMany(3);
  assert.strictEqual(bulk.length, 3);
});

// ==========================================
// MODELS & RELATIONS UNIT TESTS
// ==========================================

import {
  models,
  RELATIONS,
  userModel,
  alumniProfileModel,
  jobPostingModel,
  jobApplicationModel,
  eventModel,
  eventAttendeeModel,
  mentorshipModel
} from '../src/models/index.js';

test('Models Registry exports all 8 domain models and valid RELATIONS metadata', () => {
  assert.ok(models.User);
  assert.ok(models.AlumniProfile);
  assert.ok(models.Announcement);
  assert.ok(models.JobPosting);
  assert.ok(models.JobApplication);
  assert.ok(models.Event);
  assert.ok(models.EventAttendee);
  assert.ok(models.Mentorship);

  assert.strictEqual(RELATIONS.User.profile.cardinality, '1:1');
  assert.strictEqual(RELATIONS.User.postedJobs.cardinality, '1:N');
  assert.strictEqual(RELATIONS.User.appliedJobs.cardinality, 'N:M');
  assert.strictEqual(RELATIONS.JobPosting.poster.cardinality, '1:N');
  assert.strictEqual(RELATIONS.Event.participants.cardinality, 'N:M');
  assert.strictEqual(RELATIONS.Mentorship.mentor.cardinality, '1:N');
});

test('1:1 Relation: User <=> AlumniProfile', async () => {
  const profile = await userModel.getProfile(1);
  assert.ok(profile);
  assert.strictEqual(profile.user_id, 1);
  assert.strictEqual(profile.current_company, 'Tech Global Solutions');

  const user = await alumniProfileModel.getUser(1);
  assert.ok(user);
  assert.strictEqual(user.id, 1);
  assert.strictEqual(user.first_name, 'Rumeysa');
});

test('1:N Relation: User <=> JobPosting (posted_by)', async () => {
  const jobs = await userModel.getJobPostings(1);
  assert.ok(Array.isArray(jobs));
  assert.strictEqual(jobs.length, 1);
  assert.strictEqual(jobs[0].title, 'Junior Backend Developer');

  const poster = await jobPostingModel.getPoster(jobs[0].id);
  assert.ok(poster);
  assert.strictEqual(poster.id, 1);
  assert.strictEqual(poster.first_name, 'Rumeysa');
});

test('N:M Relation: User <=> JobPosting through JobApplication', async () => {
  const apps = await userModel.getAppliedJobs(2);
  assert.ok(Array.isArray(apps));
  assert.strictEqual(apps.length, 1);
  assert.strictEqual(apps[0].title, 'Stajyer Yazılım Geliştirici');
  assert.strictEqual(apps[0].application.status, 'PENDING');

  const applicants = await jobPostingModel.getApplicants(2);
  assert.ok(Array.isArray(applicants));
  assert.strictEqual(applicants.length, 1);
  assert.strictEqual(applicants[0].id, 2);
  assert.strictEqual(applicants[0].first_name, 'Ahmet');
});

test('1:N and N:M Relations: User <=> Event through EventAttendee', async () => {
  const creator = await eventModel.getCreator(1);
  assert.ok(creator);
  assert.strictEqual(creator.id, 3);
  assert.strictEqual(creator.first_name, 'Zeynep');

  const attendees = await eventModel.getAttendees(1);
  assert.ok(Array.isArray(attendees));
  assert.strictEqual(attendees.length, 2);

  const participants = await eventModel.getParticipants(1);
  assert.strictEqual(participants.length, 2);
  const participantIds = participants.map(p => p.id);
  assert.ok(participantIds.includes(1));
  assert.ok(participantIds.includes(2));
});

test('1:N Self-referential Relation: Mentorship (mentor & mentee)', async () => {
  const mentorships = await mentorshipModel.getByUser(1);
  assert.ok(Array.isArray(mentorships));
  assert.strictEqual(mentorships.length, 1);
  assert.strictEqual(mentorships[0].mentor_id, 1);
  assert.strictEqual(mentorships[0].mentee_id, 2);

  const mentor = await mentorshipModel.getMentor(mentorships[0].id);
  assert.strictEqual(mentor.id, 1);

  const mentee = await mentorshipModel.getMentee(mentorships[0].id);
  assert.strictEqual(mentee.id, 2);
});



