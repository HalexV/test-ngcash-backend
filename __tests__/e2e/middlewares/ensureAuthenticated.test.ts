/* eslint-disable @typescript-eslint/no-misused-promises */
import { describe, it, beforeAll, expect } from '@jest/globals';
import request from 'supertest';
import app from '../../../src/app';
import ensureAuthenticated from '../../../src/middlewares/ensureAuthenticated';

describe('Middlewares - Ensure Authenticated', () => {
  beforeAll(async () => {
    app.get('/test', ensureAuthenticated, function (request, response) {
      return response.status(200).json({
        result: 'ok',
      });
    });
  });

  it('should return 401 when token is missing', async () => {
    const response = await request(app).get('/test');

    expect(response.statusCode).toStrictEqual(401);
    expect(response.body.message).toStrictEqual('Token is missing');
  });

  it('should return 401 when token is invalid', async () => {
    const response = await request(app)
      .get('/test')
      .set(
        'authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      );

    expect(response.statusCode).toStrictEqual(401);
    expect(response.body.message).toStrictEqual('Invalid token');
  });
});
