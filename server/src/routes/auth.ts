import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { getDb } from '../database';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Register
router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const db = getDb();

    try {
      // Check if user already exists
      db.get('SELECT id FROM users WHERE username = ?', [username], async (err, row) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (row) {
          return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        db.run(
          'INSERT INTO users (username, password) VALUES (?, ?)',
          [username, hashedPassword],
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'Failed to create user' });
            }

            const token = jwt.sign({ userId: this.lastID }, JWT_SECRET, { expiresIn: '7d' });
            
            res.status(201).json({
              token,
              user: { id: this.lastID, username }
            });
          }
        );
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Login
router.post(
  '/login',
  [
    body('username').trim().notEmpty(),
    body('password').notEmpty()
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const db = getDb();

    db.get(
      'SELECT id, username, password FROM users WHERE username = ?',
      [username],
      async (err, user: any) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        
        res.json({
          token,
          user: { id: user.id, username: user.username }
        });
      }
    );
  }
);

export default router;
