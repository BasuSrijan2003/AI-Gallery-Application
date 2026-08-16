require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const setupSwagger = require('./config/swagger');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());

connectDB();
setupSwagger(app);

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send("Auth Microservice is live!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});