import { Request } from "express";

export interface JwtPayload {
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
  isGuessCorrect?: boolean
}

export interface CustomRequest extends Request {
  userInfo: {
    _id: string;
  }
}