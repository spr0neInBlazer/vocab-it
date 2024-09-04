import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface CustomJwtPayload extends JwtPayload {
  UserInfo: {
    _id: string,
    username: string,
    roles: string[],
    wordsPerLesson: number,
  }
}

export interface Word {
  _id?: string,
  word: string,
  translation: string,
  progress?: number,
  trained: number,
}

export interface UserAnswer {
  _id: string,
  userAnswer: string
}

export interface CustomRequest extends Request {
  userInfo: {
    _id?: string,
    username: string
  }
}