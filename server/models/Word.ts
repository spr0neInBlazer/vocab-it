import mongoose, { Schema, Types } from "mongoose";

interface Word {
  word: string;
  translation: string;
}

const wordSchema = new Schema<Word>({
  word: {
    type: String,
    required: true
  },
  translation: {
    type: String,
    required: true
  }
});

export default mongoose.model('Word', wordSchema);
