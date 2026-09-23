const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// GET / "ok"
app.get('/', (req, res) => {
  res.send('ok');
});

// GET /hello "hello, world"
app.get('/hello', (req, res) => {
  res.send('hello, world');
});

// GET /hello/{name} "hello, name"
app.get('/hello/:name', (req, res) => {
  res.send(`hello, ${req.params.name}`);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
