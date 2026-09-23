const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// GET / "ok"
app.get('/', (req, res) => {
  res.send('ok');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
