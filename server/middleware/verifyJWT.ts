import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

function verifyJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.sendStatus(401); // Unauthorized
  }

  const token = authHeader.split(' ')[1];
  const accessSecret = process.env.ACCESS_TOKEN_SECRET;
  if (!accessSecret) {
    return res.sendStatus(401); // Unauthorized
  }
  jwt.verify(
    token,
    accessSecret,
    (err, decoded) => {
      if (err) return res.sendStatus(403);
      req.username = decoded.UserInfo.username;
      req.roles = decoded.UserInfo.roles;
      next();
    }
  )
}

export default verifyJWT;
