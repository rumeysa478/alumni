const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// GET / "temporary one main page"
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Alumni Tracking System - Main Page</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; max-width: 750px; margin: 40px auto; padding: 0 20px; line-height: 1.6; color: #1f2937; }
        h1 { color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px; }
        .badge { background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 9999px; font-size: 0.85rem; font-weight: 600; display: inline-block; margin-bottom: 15px; }
        ul { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px 40px; }
        li { margin-bottom: 10px; }
        a { color: #2563eb; text-decoration: none; font-weight: 500; }
        a:hover { text-decoration: underline; }
        code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-family: Consolas, monospace; }
      </style>
    </head>
    <body>
      <span class="badge">Temporary Main Page</span>
      <h1>🎓 Alumni Tracking System</h1>
      <p>Welcome to the <strong>Alumni Tracking System</strong> web application developed for the 3rd Year Web Programming Course.</p>
      
      <h3>Available Routes:</h3>
      <ul>
        <li><a href="/hello"><code>GET /hello</code></a> — Returns <em>"hello, world"</em></li>
        <li><a href="/hello/emre"><code>GET /hello/emre</code></a> — Returns <em>"hello, emre"</em></li>
        <li><a href="/sum/15/25"><code>GET /sum/15/25</code></a> — Returns sum of two numbers (40)</li>
        <li><a href="/about"><code>GET /about</code></a> — Temporary About Page</li>
      </ul>
    </body>
    </html>
  `);
});

// GET /hello "hello, world"
app.get('/hello', (req, res) => {
  res.send('hello, world');
});

// GET /hello/{name} "hello, name"
app.get('/hello/:name', (req, res) => {
  res.send(`hello, ${req.params.name}`);
});

// GET /sum/{num1}/{num2}
app.get('/sum/:num1/:num2', (req, res) => {
  const num1 = Number(req.params.num1);
  const num2 = Number(req.params.num2);

  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).send('Please provide valid numbers');
  }

  const sum = num1 + num2;
  res.send(`${sum}`);
});

// GET /about "temp about page"
app.get('/about', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>About - Alumni Tracking System</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; max-width: 750px; margin: 40px auto; padding: 0 20px; line-height: 1.6; color: #1f2937; }
        h1 { color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px; }
        .badge { background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 9999px; font-size: 0.85rem; font-weight: 600; display: inline-block; margin-bottom: 15px; }
        .card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-top: 20px; }
        a { color: #2563eb; text-decoration: none; font-weight: 500; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <span class="badge">Temporary About Page</span>
      <h1>ℹ️ About This Project</h1>
      <div class="card">
        <h3>Alumni Tracking System</h3>
        <p><strong>Course:</strong> 3rd Year Web Programming</p>
        <p><strong>Developer:</strong> Rumeysa Aydın</p>
        <p><strong>Technologies:</strong> Node.js, Express.js, PostgreSQL, Docker, GitHub</p>
        <p><strong>Description:</strong> This web project aims to provide an active networking and career tracking platform connecting university graduates, students, and faculty members.</p>
      </div>
      <p style="margin-top: 25px;"><a href="/">← Return to Main Page</a></p>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
