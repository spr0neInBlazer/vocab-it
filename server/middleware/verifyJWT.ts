import { NextFunction, Response } from "express";
import jwt, {JwtPayload} from 'jsonwebtoken';
import { CustomJwtPayload } from "../types";

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
  
  jwt.verify(
    token, 
    accessSecret,
    (err, decoded) => {
      if (err) return res.sendStatus(403);
      if (typeof decoded !== 'string' && 'UserInfo' in decoded) {
        req.userInfo = decoded.UserInfo;
      } else {
        return res.sendStatus(403);
      }
      next();
    }
  );
}

export default verifyJWT;
