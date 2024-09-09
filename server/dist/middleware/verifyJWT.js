"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
        return res.sendStatus(401); // Unauthorized
    }
    const token = authHeader.split(' ')[1];
    const accessSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accessSecret) {
        return res.sendStatus(401); // Unauthorized
    }
    jsonwebtoken_1.default.verify(token, accessSecret, (err, decoded) => {
        if (err)
            return res.sendStatus(403);
        if (typeof decoded !== 'string' && 'UserInfo' in decoded) {
            req.userInfo = decoded.UserInfo;
        }
        else {
            return res.sendStatus(403);
        }
        next();
    });
}
exports.default = verifyJWT;
