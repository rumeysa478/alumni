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

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
