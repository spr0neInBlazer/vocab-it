import jwt from 'jsonwebtoken';
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
    jwt.verify(token, accessSecret, (err, decoded) => {
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
export default verifyJWT;
