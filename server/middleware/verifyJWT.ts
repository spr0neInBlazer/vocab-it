import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { JwtPayload } from "../types";

function verifyJWT(req, res: Response, next: NextFunction) {
  const authHeader: string | undefined = req.headers.authorization || req.headers.Authorization as string | undefined;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.sendStatus(401); // Unauthorized
  }

  const token = authHeader.split(' ')[1];
  const accessSecret = process.env.ACCESS_TOKEN_SECRET;
  if (!accessSecret) {
    return res.sendStatus(401); // Unauthorized
  }
  const decoded = jwt.verify(token, accessSecret) as JwtPayload;
  // req._id = decoded.UserInfo._id;
  // req.username = decoded.UserInfo.username;
  // req.roles = decoded.UserInfo.roles;
  req.userInfo = decoded.UserInfo;
  next();
}

export default verifyJWT;
