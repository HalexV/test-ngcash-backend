/* eslint-disable @typescript-eslint/no-misused-promises */
import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../../../src/app';

describe('Routes - Root', () => {
  describe('GET /', () => {
    it('should return 200 on success', async () => {
      const response = await request(app).get('/');

      const expectedJSON = {
        safe: true,
      };

      expect(response.statusCode).toStrictEqual(200);
      expect(response.body).toEqual(expectedJSON);
    });
  });
});
