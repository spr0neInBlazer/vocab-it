"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const refreshController_1 = __importDefault(require("../controllers/refreshController"));
const refreshRouter = express_1.default.Router();
refreshRouter.post('/', refreshController_1.default);
exports.default = refreshRouter;
