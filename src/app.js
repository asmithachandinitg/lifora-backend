const express = require('express');
const cors = require('cors');

const app = express();
const userRoutes = require('./modules/users/user.routes');
const diaryRoutes = require('./modules/diary/diary.routes');

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/diary', diaryRoutes);

app.get('/', (req, res) => {
  res.send('Lifora API running 💜');
});

module.exports = app;
