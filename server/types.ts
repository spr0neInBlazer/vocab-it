interface JwtPayload {
  UserInfo: {
    _id: string,
    username: string,
    roles: string[],
    wordsPerLesson: number,
  }
}

export {JwtPayload}