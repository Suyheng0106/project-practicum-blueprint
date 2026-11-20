import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { AppError } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';
import { Role } from '@prisma/client';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'devpath_super_secret_jwt_key_2026_capstone';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// EP-02: Register
authRouter.post('/register', async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      throw new AppError(400, 'VALIDATION_ERROR', 'A valid email address is required.');
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Password must be at least 8 characters long.');
    }

    if (!role || !Object.values(Role).includes(role as Role)) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Role must be either CANDIDATE or EMPLOYER.');
    }

    // Check conflict
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError(409, 'CONFLICT', 'Email address is already registered to another account.');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: role as Role,
      },
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// EP-03: Login
authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Email and password are required.');
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError(401, 'UNAUTHORIZED', 'Incorrect email or password.');
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      throw new AppError(401, 'UNAUTHORIZED', 'Incorrect email or password.');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: (JWT_EXPIRES_IN as any) }
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

// EP-04: Me
authRouter.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user) {
      throw new AppError(404, 'NOT_FOUND', 'User account not found.');
    }

    res.status(200).json({
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    });
  } catch (err) {
    next(err);
  }
});
