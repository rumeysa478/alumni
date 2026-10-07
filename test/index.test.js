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
    assert.ok(body.includes('Rümeysa'));
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
    assert.ok(body.includes('Rümeysa'));
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
      first_name: 'Rümeysa',
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
        first_name: 'Rümeysa',
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

test('GET /api/swagger.json returns OpenAPI spec', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/swagger.json`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.openapi, '3.0.0');
    assert.ok(body.paths['/users']);
    assert.ok(body.paths['/api/users']);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
