
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('MongoDB connected!');
});

const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const shortener = require('./routes/shortener');
app.use('/', shortener);

const imageConverter = require('./routes/imageConverter');
app.use('/api/convert', imageConverter);

const pdfConverter = require('./routes/pdfConverter');
app.use('/api/convert', pdfConverter);

const textToPdf = require('./routes/textToPdf');
app.use('/api/convert', textToPdf);

const officeConverter = require('./routes/officeConverter');
app.use('/api/convert', officeConverter);

const auth = require('./routes/auth');
app.use('/api/auth', auth);

app.get('/', (req, res) => {
  res.send('Hello from Utility Hub Backend!');
});

app.get('/health', (req, res) => {
  res.status(200).send('Backend is healthy!');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
