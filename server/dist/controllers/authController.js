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
function handleLogin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { username, pwd } = req.body;
            if (!username || !pwd) {
                return res.status(400).json({ 'message': 'Username and password are required' });
            }
            const foundUser = yield User_1.default.findOne({ username }).exec();
            if (!foundUser) {
                return res.sendStatus(401); // Unauthorized
            }
            const match = yield bcrypt_1.default.compare(pwd, foundUser.password);
            if (!match) {
                return res.status(400).json({ msg: 'Invalid password' });
            }
            const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
            const accessSecret = process.env.ACCESS_TOKEN_SECRET;
            if (!refreshSecret || !accessSecret) {
                throw new Error('Token secrets are not defined');
            }
            const roles = Object.values(foundUser.roles).filter(Boolean);
            const accessToken = jsonwebtoken_1.default.sign({
                "UserInfo": {
                    "_id": foundUser._id,
                    "username": foundUser.username,
                    "roles": roles
                }
            }, accessSecret, { expiresIn: '10m' });
            const refreshToken = jsonwebtoken_1.default.sign({ "_id": foundUser._id }, refreshSecret, { expiresIn: '1d' });
            foundUser.refreshToken = refreshToken;
            yield foundUser.save();
            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: "none", secure: true, maxAge: 24 * 60 * 60 * 1000 });
            res.json({ accessToken });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ msg: error.message });
        }
    });
}
exports.default = handleLogin;
