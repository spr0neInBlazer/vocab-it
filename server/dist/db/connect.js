var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        const dbUri = process.env.DATABASE_URI;
        try {
            if (!dbUri) {
                throw new Error();
            }
            yield mongoose.connect(dbUri);
        }
        catch (error) {
            console.error(error);
        }
    });
}
export default connectDB;
