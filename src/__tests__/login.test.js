const request = require('supertest');
const app = require('../app');
const { hashPassword } = require('../auth/helpers/password-helper');
const db = require('../models');

describe('POST /login', () => {
  beforeAll(async () => {
    const datas = [
      {
        full_name: 'test test',
        email: 'test@test.com',
        password: await hashPassword('password'),
      },
      {
        full_name: 'joy doe',
        email: 'joy@test.com',
        password: await hashPassword('password'),
      },
      {
        full_name: 'wale doe',
        email: 'wale@test.com',
        password: await hashPassword('password'),
      },
      {
        full_name: 'funke doe',
        email: 'funke@test.com',
        password: await hashPassword('password'),
      },
    ];
    await db.User.bulkCreate(datas);
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

   test('should not login with invalid password', (done) => {
    const data = {
      email: 'test@test.com',
      password: 'passwords',
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

   test('should lock account for 1 minute after trying to login 4 times', async () => {
    const data = {
      email: 'joy@test.com',
      password: 'passwords',
    };
    const status = [];
    for (let i = 0; i < 4; i++) {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .set('Content-Type', 'application/json')
        .send(data);
      status.push({
        statusCode: response.statusCode,
        message: response.body.message,
      });
    }
    expect(status).toHaveLength(4);
    expect(status).toEqual([
      { statusCode: 400, message: 'Invalid email or password' },
      { statusCode: 400, message: 'Invalid email or password' },
      { statusCode: 400, message: 'Invalid email or password' },
      { statusCode: 400, message: 'Your account has been locked for 1 minute' },
    ]);
  });

  test('should lock account permanently after 4 tries and attempting to login before 1 minute grace period', async () => {
    const data = {
      email: 'wale@test.com',
      password: 'passwords',
    };
    const status = [];
    for (let i = 0; i < 5; i++) {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .set('Content-Type', 'application/json')
        .send(data);
      status.push({
        statusCode: response.statusCode,
        message: response.body.message,
      });
    }
    expect(status).toHaveLength(5);
    expect(status).toEqual([
      { statusCode: 400, message: 'Invalid email or password' },
      { statusCode: 400, message: 'Invalid email or password' },
      { statusCode: 400, message: 'Invalid email or password' },
      { statusCode: 400, message: 'Your account has been locked for 1 minute' },
      { statusCode: 400, message: 'Your account will be locked for life' },
    ]);
  });

  test('should login after trying 2 invalid passwords and 1 valid password', async () => {
    const datas = [
      {
        email: 'funke@test.com',
        password: 'passwords',
      },
      {
        email: 'funke@test.com',
        password: 'passwords',
      },
      {
        email: 'funke@test.com',
        password: 'password',
      }
    ];
    const status = [];
    for (let i = 0; i < 3; i++) {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .set('Content-Type', 'application/json')
        .send(datas[i]);
      status.push({
        statusCode: response.statusCode,
        message: response.body.message,
      });
    }
    expect(status).toHaveLength(3);
    expect(status).toEqual([
      { statusCode: 400, message: 'Invalid email or password' },
      { statusCode: 400, message: 'Invalid email or password' },
      { statusCode: 200, message: 'Login successful' },
    ]);
  });
});