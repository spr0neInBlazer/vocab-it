import mongoose, { Schema, Types } from "mongoose";
import { Word } from "../types";

const wordSchema = new Schema<Word>({
  _id: {
    type: String,
    required: true,
  },
  word: {
    type: String,
    required: true
  },
  translation: {
    type: String,
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  trained: {
    type: Number,
    default: 0
  }
});


interface Vocabulary {
  title: string;
  words: Word[];
  userId: Types.ObjectId;
}

const vocabSchema = new Schema<Vocabulary>({
  title: {
    type: String,
    required: true
  },
  words: {
    type: [wordSchema],
    default: []
  },
  userId: {
    type: Schema.Types.ObjectId, 
    ref: 'User'
  }
});

export default mongoose.model('Vocabulary', vocabSchema);
