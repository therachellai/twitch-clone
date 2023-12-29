import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './src/routes/authRoutes.js';
import channelsRoutes from './src/routes/channelsRoutes.js';
import settingsRoutes from './src/routes/settingsRoutes.js';

dotenv.config();

const PORT = process.env.PORT || process.env.API_PORT;

const app = express();

app.use(express.json());

app.use(cors());

// Check if API is working
app.get('/', (req, res) => {
    return res.send("Hello, here is your server.")
})

app.use('/api/auth', authRoutes);
app.use('/api/channels', channelsRoutes)
app.use('/api/settings', settingsRoutes)

// Create server
const server = http.createServer(app);

mongoose
    .connect(process.env.MONGOURI)
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    }).catch(err => {
        console.log('Database connection failed. Server not started');
        console.log(err);
    })
