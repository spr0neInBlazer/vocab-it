import mongoose, { Schema, Types } from "mongoose";

interface Vocabulary {
  name: string;
  words: Types.ObjectId;
  user: Types.ObjectId;
}

const vocabSchema = new Schema<Vocabulary>({
  name: {
    type: String,
    required: true
  },
  words: [{
    type: Types.ObjectId,
    ref: 'Word'
  }],
  user: {
    type: Schema.Types.ObjectId, 
    ref: 'User'
  }
});

export default mongoose.model('Vocabulary', vocabSchema);
