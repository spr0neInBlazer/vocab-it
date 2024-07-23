import mongoose, { Schema, Types } from "mongoose";

interface User {
  username: string;
  password: string;
  roles: string[];
  vocabularies: Types.ObjectId[];
  wordsPerLesson: number,
  refreshToken: string
}

const userSchema = new Schema<User>({
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
