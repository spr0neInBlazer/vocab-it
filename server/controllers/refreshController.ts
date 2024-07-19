import { Request, Response } from "express";
import User from "../models/User";
import jwt from 'jsonwebtoken';

interface DecodedPayload {
  _id: string,
  username: string,
  roles: string[],
  wordsPerLesson: number,
}

async function handleRefreshToken(req: Request, res: Response) {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    console.log({ msg: 'no refresh token', cookies });
    return res.sendStatus(401); // Unauthorized
  }

  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    return res.sendStatus(403); // Forbidden
  }

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as DecodedPayload;
  if (foundUser.username !== decoded.username) {
    return res.sendStatus(403);
  }
  const roles = Object.values(foundUser.roles);
  const accessToken = jwt.sign(
    {
      "UserInfo": {
        "username": decoded.username,
        "roles": roles
      }
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15s' }
  );
  res.json({ accessToken });
}

export default handleRefreshToken;
