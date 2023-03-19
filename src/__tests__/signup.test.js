const request = require('supertest');
const app = require('../app');

describe('POST /signup', () => {
  test('should register new user', (done) => {
    const body = {
      fullName: 'John Doe',
      email: 'jonedoe@test.com',
      password: 'password',
    };
    request(app)
      .post('/api/v1/auth/register')
      .set('Content-Type', 'application/json')
      .send(body)
      .end((err, res) => {
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'User created successfully');
        expect(res.body).toHaveProperty('data');
        if (err) return done(err);
        done();
    });
  })
  test('should not register user if email already exist', (done) => {
    const body = {
      fullName: 'John Doe',
      email: 'jonedoe@test.com',
      password: 'password',
    };
    request(app)
      .post('/api/v1/auth/register')
      .set('Content-Type', 'application/json')
      .send(body)
      .end((err, res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Email already exists. Please login with your credentials');
        if (err) return done(err);
        done();
    });
  })
  test('should not register user if field are missing from request body', (done) => {
    const body = {
      password: 'password',
    };
    request(app)
      .post('/api/v1/auth/register')
      .set('Content-Type', 'application/json')
      .send(body)
      .end((err, res) => {
        expect(res.statusCode).toEqual(422);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toHaveLength(2);
        expect(res.body).toHaveProperty('message[0].fullName', 'fullName is required');
        expect(res.body).toHaveProperty('message[1].email', 'email is required');
        if (err) return done(err);
        done();
    });
  })
});