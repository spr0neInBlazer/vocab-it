import mongoose, { Schema, Types } from "mongoose";
const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Please provide username']
    },
    roles: {
        User: {
            type: Number,
            default: 1305
        },
        Admin: Number
    },
    password: {
        type: String,
        required: [true, 'please provide password'],
        minlength: 6
    },
    vocabularies: [{
            type: Types.ObjectId,
            ref: 'Vocabulary'
        }],
    wordsPerLesson: {
        type: Number,
        default: 20
    },
    refreshToken: String
});
export default mongoose.model('User', userSchema);
