"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
function handleNewUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, pwd } = req.body;
        if (!username || !pwd) {
            return res.status(400).json({ 'message': 'Username and password are required' });
        }
        const duplicate = yield User_1.default.findOne({ username }).exec();
        if (duplicate) {
            return res.send(409).json({ 'message': 'User with this name already exists' });
        }
        try {
            const hashedPwd = yield bcrypt_1.default.hash(pwd, 10);
            const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
            const accessSecret = process.env.ACCESS_TOKEN_SECRET;
            if (!refreshSecret || !accessSecret) {
                throw new Error('Token secrets are not defined');
            }
            const userId = new mongoose_1.default.Types.ObjectId();
            const accessToken = jsonwebtoken_1.default.sign({
                "UserInfo": {
                    "_id": userId,
                    "username": username,
                    "roles": [1305]
                }
            }, accessSecret, { expiresIn: '10m' });
            const refreshToken = jsonwebtoken_1.default.sign({ "_id": userId }, refreshSecret, { expiresIn: '1d' });
            const result = yield User_1.default.create({
                "_id": userId,
                "username": username,
                "password": hashedPwd,
                "vocabularies": [],
                "refreshToken": refreshToken
            });
            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 24 * 60 * 60 * 1000 });
            res.status(201).json({ 'message': 'User registered successfully', accessToken });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ 'message': error.message });
            }
            else {
                res.status(500).json({ 'message': 'Unknown error' });
            }
        }
    });
}
exports.default = handleNewUser;
