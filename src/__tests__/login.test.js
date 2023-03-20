const request = require('supertest');
const app = require('../app');
const { hashPassword } = require('../auth/helpers/password-helper');
const db = require('../models');

describe('POST /login', () => {
  beforeAll(async () => {
    const data = {
      full_name: 'test test',
      email: 'test@test.com',
      password: await hashPassword('password'),
    };
    await db.User.create(data);
  });


  test('should login a user', (done) => {
    const data = {
      email: 'test@test.com',
      password: 'password',
    }
    request(app)
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send(data)
      .end((err, res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Login successful');
        expect(res.body).toHaveProperty('data');
        if (err) return done(err);
        done();
      });
  });

  test('should not login a user with invalid email', (done) => {
    const data = {
      email: 'jodoe@test.com',
      password: 'password',
    };
    request(app)
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send(data)
      .end((err, res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Invalid email or password');
        if (err) return done(err);
        done();
      });
  });

  test('should not validate login credentials without email', (done) => {
    const data = {
      password: 'password',
    };
    request(app)
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send(data)
      .end((err, res) => {
        expect(res.statusCode).toEqual(422);
        expect(res.body).toHaveProperty('message[0].email', 'email is required');
        if (err) return done(err);
        done();
      });
  });
  test('should not validate login credentials with invalid email', (done) => {
    const data = {
      email: 'jodoe@test',
      password: 'password',
    };
    request(app)
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send(data)
      .end((err, res) => {
        expect(res.statusCode).toEqual(422);
        expect(res.body).toHaveProperty('message[0].email', 'email must be a valid email');
        if (err) return done(err);
        done();
      });
    });

  test('should not validate login credentials without password', (done) => {
    const data = {
      email: 'jodoe@test.com',
    };
    request(app)
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send(data)
      .end((err, res) => {
        expect(res.statusCode).toEqual(422);
        expect(res.body).toHaveProperty('message[0].password', 'password is required');
        if (err) return done(err);
        done();
      });
    });

  test('should not validate login credentials with password less than 6 characters', (done) => {
    const data = {
      email: 'jodoe@test.com',
      password: 'pass',
    };
    request(app)
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send(data)
      .end((err, res) => {
        expect(res.statusCode).toEqual(422);
        expect(res.body).toHaveProperty('message[0].password', 'password length must be at least 6 characters long');
        if (err) return done(err);
        done();
      });
    });
});