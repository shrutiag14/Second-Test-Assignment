import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { getDb } from '../database';
import { authenticate, optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all calculation trees
router.get('/tree', optionalAuth, (req: AuthRequest, res: Response) => {
  const db = getDb();

  db.all(
    `SELECT 
      c.id, 
      c.user_id, 
      c.parent_id, 
      c.is_starting_number, 
      c.operation, 
      c.operand, 
      c.result, 
      c.created_at,
      u.username
    FROM calculations c
    JOIN users u ON c.user_id = u.id
    ORDER BY c.created_at DESC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json(rows);
    }
  );
});

// Create starting number
router.post(
  '/start',
  authenticate,
  [
    body('number').isNumeric().withMessage('Starting number must be numeric')
  ],
  (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { number } = req.body;
    const db = getDb();

    db.run(
      `INSERT INTO calculations (user_id, is_starting_number, result) 
       VALUES (?, 1, ?)`,
      [req.userId, number],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create starting number' });
        }

        db.get(
          `SELECT 
            c.id, 
            c.user_id, 
            c.parent_id, 
            c.is_starting_number, 
            c.operation, 
            c.operand, 
            c.result, 
            c.created_at,
            u.username
          FROM calculations c
          JOIN users u ON c.user_id = u.id
          WHERE c.id = ?`,
          [this.lastID],
          (err, row) => {
            if (err) {
              return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json(row);
          }
        );
      }
    );
  }
);

// Add operation to a calculation
router.post(
  '/operation',
  authenticate,
  [
    body('parentId').isInt().withMessage('Parent ID must be an integer'),
    body('operation').isIn(['+', '-', '*', '/']).withMessage('Invalid operation'),
    body('operand').isNumeric().withMessage('Operand must be numeric')
  ],
  (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { parentId, operation, operand } = req.body;
    const db = getDb();

    // Get parent calculation
    db.get(
      'SELECT result FROM calculations WHERE id = ?',
      [parentId],
      (err, parent: any) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (!parent) {
          return res.status(404).json({ error: 'Parent calculation not found' });
        }

        // Calculate result
        let result: number;
        const leftOperand = parent.result;
        const rightOperand = parseFloat(operand);

        switch (operation) {
          case '+':
            result = leftOperand + rightOperand;
            break;
          case '-':
            result = leftOperand - rightOperand;
            break;
          case '*':
            result = leftOperand * rightOperand;
            break;
          case '/':
            if (rightOperand === 0) {
              return res.status(400).json({ error: 'Cannot divide by zero' });
            }
            result = leftOperand / rightOperand;
            break;
          default:
            return res.status(400).json({ error: 'Invalid operation' });
        }

        // Insert new calculation
        db.run(
          `INSERT INTO calculations (user_id, parent_id, is_starting_number, operation, operand, result) 
           VALUES (?, ?, 0, ?, ?, ?)`,
          [req.userId, parentId, operation, operand, result],
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'Failed to create calculation' });
            }

            db.get(
              `SELECT 
                c.id, 
                c.user_id, 
                c.parent_id, 
                c.is_starting_number, 
                c.operation, 
                c.operand, 
                c.result, 
                c.created_at,
                u.username
              FROM calculations c
              JOIN users u ON c.user_id = u.id
              WHERE c.id = ?`,
              [this.lastID],
              (err, row) => {
                if (err) {
                  return res.status(500).json({ error: 'Database error' });
                }
                res.status(201).json(row);
              }
            );
          }
        );
      }
    );
  }
);

export default router;
