import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Simple test route
app.get('/api/health', (req, res) => {
    res.json({message: "Server is running" });
})

export default app;