const request = require('supertest');
const app = require('../app');

describe('POST /login', () => {
  test('should login a user', (done) => {
    const data = {
      email: 'jonedoe@test.com',
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
});