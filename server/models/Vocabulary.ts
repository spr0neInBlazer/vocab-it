import mongoose, { Schema, Types } from "mongoose";
import { LangCodes, Word } from "../types";

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
  lang: LangCodes;
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
  },
  lang: {
    type: String,
    default: 'default'
  }
});

export default mongoose.model('Vocabulary', vocabSchema);
