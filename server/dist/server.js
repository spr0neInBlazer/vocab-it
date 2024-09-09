"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const connect_1 = __importDefault(require("./db/connect"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const corsOptions_1 = require("./config/corsOptions");
const credentials_1 = __importDefault(require("./middleware/credentials"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const register_1 = __importDefault(require("./routes/register"));
const auth_1 = __importDefault(require("./routes/auth"));
const logout_1 = __importDefault(require("./routes/logout"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const verifyJWT_1 = __importDefault(require("./middleware/verifyJWT"));
const profile_1 = __importDefault(require("./routes/profile"));
const refresh_1 = __importDefault(require("./routes/refresh"));
const notFound_1 = __importDefault(require("./middleware/notFound"));
const vocabulary_1 = __importDefault(require("./routes/vocabulary"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3500;
(0, connect_1.default)();
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 20,
});
app.use((0, compression_1.default)());
app.use((0, helmet_1.default)());
app.use(limiter);
app.use(credentials_1.default);
app.use((0, cors_1.default)(corsOptions_1.corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/register', register_1.default);
app.use('/auth', auth_1.default);
app.use('/logout', logout_1.default);
app.use('/refresh', refresh_1.default);
// Protected routes
app.use('/profile', verifyJWT_1.default, profile_1.default);
app.use('/vocabs', verifyJWT_1.default, vocabulary_1.default);
app.all('*', notFound_1.default);
app.use(errorHandler_1.default);
mongoose_1.default.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
});
