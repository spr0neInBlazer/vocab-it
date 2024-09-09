"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logoutController_1 = __importDefault(require("../controllers/logoutController"));
const logoutRouter = express_1.default.Router();
logoutRouter.get('/', logoutController_1.default);
exports.default = logoutRouter;
