import request from 'supertest';
import app from '../index';

describe('Auth API', () => {
  const testUser = {
    username: 'testuser' + Date.now(),
    password: 'password123'
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('username', testUser.username);
    });

    it('should reject duplicate username', async () => {
      await request(app)
        .post('/api/auth/register')
        .send(testUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject invalid username', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: 'ab', password: 'password123' });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeAll(async () => {
      await request(app)
        .post('/api/auth/register')
        .send(testUser);
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send(testUser);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: testUser.username, password: 'wrongpassword' });

      expect(response.status).toBe(401);
    });
  });
});
