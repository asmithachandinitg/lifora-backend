const express = require('express');
const cors = require('cors');

const app = express();
const userRoutes = require('./modules/users/user.routes');
const diaryRoutes = require('./modules/diary/diary.routes');
const taskRoutes = require('./modules/tasks/tasks.routes');
const expenseRoutes = require('./modules/expenses/expense.routes');
const moodRoutes = require('./modules/mood/mood.routes');
const goalRoutes = require('./modules/goals/goal.routes');
const sleepRoutes   = require('./modules/sleep/sleep.routes'); 

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/sleep',    sleepRoutes); 

app.get('/', (req, res) => {
  res.send('Lifora API running');
});

module.exports = app;


