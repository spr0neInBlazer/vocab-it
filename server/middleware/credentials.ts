import { NextFunction, Request, Response } from "express";
import allowedOrigins from "../config/allowedOrigins";

function credentials(req: Request, res: Response, next: NextFunction) {
  const origin: string | undefined = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  next();
}

export default credentials;