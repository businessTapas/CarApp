const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const carRoutes = require('./routes/carRoutes');
const authRoutes = require('./routes/authRoutes');
const bodyParser = require('body-parser');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

app.use('/uploads', express.static('uploads'));
app.use('/api/cars', carRoutes);
app.use('/api/auth', authRoutes);
app.use(errorHandler);

app.listen(process.env.PORT || 5000, () => console.log('Server running'));
