import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoute';
import projectRoutes from './routes/projectRoute';
import taskRoutes from './routes/taskRoute';

dotenv.config();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

//Simple test route
app.get('/api/health', (req, res) => {
    res.json({message: "Server is running" });
})

export default app;