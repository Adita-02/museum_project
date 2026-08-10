import dotenv from 'dotenv';
dotenv.config();

import dns from 'dns';
dns.setServers(['1.1.1.1', '8.8.8.8']);

import userRoutes from './routes/userRoutes.js';   

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import artifactRoutes from './routes/artifactsRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import placeRoutes from './routes/placeRoutes.js';
import africaRoutes from './routes/africaRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import suggestionRoutes from './routes/suggestions.js';
import civilizationRoutes from './routes/civilizationRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/artifacts', artifactRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/orders', orderRoutes); 
app.use('/api/users', userRoutes); 
app.use('/api/places', placeRoutes);
app.use('/api/africa', africaRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api', civilizationRoutes);
console.log('✅ Auth routes mounted on /api/auth');

app.get('/', (req, res) => {
    res.send('API is running... ');
});

connectDB();

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});