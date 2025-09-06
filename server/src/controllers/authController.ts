import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

// Helper function to generate JWT
const generateToken = (userId: string): string => {
    // Ensure you have a secret key in your environment variables
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT secret key is not defined in environment variables');
    };
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// Register controller
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            name,
            email,
            password,
        } = req.body;

        // Validation
        if (!name || !email || !password) {
            res.status(400).json({ message: 'Please provide all required fields' });
            return;
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        // Create new user
        const user: IUser = new User({ name, email, password });
        await user.save();

        // Generate JWT
        const token = generateToken(user._id as unknown as string).toString();

        // Respond with user data and token
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Login controller
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            res.status(400).json({ message: 'Please provide email and password' });
            return;
        }

        // Find user and include password for verification
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        // console.log('User ID being used for token:', (user._id as unknown as string).toString());
        // Generate JWT
        const token = generateToken(user._id as unknown as string).toString();

        // Respond with user data and token
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get current user profile
export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        // req.user is attached by the protect middleware
        res.status(200).json({
            user: {
                id: req.user?._id,
                name: req.user?.name,
                email: req.user?.email,
                createdAt: req.user!.createdAt
            }
        });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}