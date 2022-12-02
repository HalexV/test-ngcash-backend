import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../client';

const jwtSecret = process.env.JWT_SECRET ?? '12kflnfoi34493j0jkdsmalsaejp';

interface IPayload {
  id: string;
}

export default async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | any> {
  const authHeader = request.headers.authorization;

  if (authHeader == null)
    return response.status(401).json({
      message: 'Token is missing',
    });

  const [, token] = authHeader.split(' ');

  try {
    const { id: username } = jwt.verify(token, jwtSecret) as IPayload;

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (user == null)
      return response.status(401).json({
        message: 'User does not exist',
      });

    request.user = {
      username: user.username,
      accountId: user.accountId,
    };

    return next();
  } catch (error) {
    console.log({
      at: 'ensureAuthenticated',
      error,
    });
    return response.status(401).json({
      message: 'Invalid token',
    });
  }
}
