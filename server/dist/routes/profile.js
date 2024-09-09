"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profileController_1 = require("../controllers/profileController");
const profileRouter = express_1.default.Router();
profileRouter.get('/', profileController_1.getProfile);
profileRouter.patch('/updateUsername', profileController_1.updateUsername);
profileRouter.delete('/deleteAccount', profileController_1.deleteAccount);
exports.default = profileRouter;
