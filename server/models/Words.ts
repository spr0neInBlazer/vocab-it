import mongoose, { Schema, Types } from "mongoose";

interface Word {
  word: string;
  translation: string;
  vocabulary: Types.ObjectId;
}

const wordSchema = new Schema<Word>({
  word: {
    type: String,
    required: true
  },
  translation: {
    type: String,
    required: true
  },
  vocabulary: {
    type: Schema.Types.ObjectId, 
    ref: 'Vocabulary'
  }
});

export default mongoose.model('Word', wordSchema);
