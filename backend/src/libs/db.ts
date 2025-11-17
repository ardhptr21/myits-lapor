import mongoose from 'mongoose';

export const connectToDB = async (uri: string, cb: (error?: Error) => void) => {
  try {
    await mongoose.connect(uri);
  } catch (error) {
    return cb(error as Error);
  }
  cb();
};
