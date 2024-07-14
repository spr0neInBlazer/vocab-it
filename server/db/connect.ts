import mongoose from "mongoose";

async function connectDB() {
  const dbUri = process.env.DATABASE_URI;
  try {
    if (!dbUri) {
      throw new Error();
    }
    await mongoose.connect(dbUri);
  } catch (error) {
    console.error(error);
  }
}

export default connectDB;