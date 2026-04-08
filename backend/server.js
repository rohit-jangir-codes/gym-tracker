require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/error');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/workout-plans', require('./src/routes/workoutPlans'));
app.use('/api/workout-logs', require('./src/routes/workoutLogs'));
app.use('/api/progress', require('./src/routes/progress'));
app.use('/api/dashboard', require('./src/routes/dashboard'));
app.use('/api/admin', require('./src/routes/admin'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
