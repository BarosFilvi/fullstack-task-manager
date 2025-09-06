// server/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User, { IUser } from '../models/User';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({ message: 'Not authorized, no token provided' });
      return;
    }

    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: 'JWT secret not configured' });
      return;
    }

    // DEBUG: Kiểm tra token trước khi verify
    // console.log('Token received:', token);

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('Full decoded token:', decoded); // <-- Xem toàn bộ decoded object

    // Kiểm tra cấu trúc decoded object
    if (!decoded || typeof decoded !== 'object') {
      res.status(401).json({ message: 'Invalid token structure' });
      return;
    }

    // Tìm userId trong decoded object (có thể ở các property khác nhau)
    const userId = decoded.userId || decoded.id || decoded._id;
    // console.log('Extracted userId:', userId);

    if (!userId) {
      res.status(401).json({ message: 'UserId not found in token' });
      return;
    }

    // console.log('Type of userId:', typeof userId);
    // console.log('Value of userId:', userId);

    // Tìm user
    const user = await User.findOne({ _id: userId }).select('-password');
    // console.log('User found with findOne:', user);

    if (!user) {
      res.status(401).json({ message: 'Not authorized, user not found' });
      return;
    }

    req.user = user;
    next();

  } catch (error: any) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};