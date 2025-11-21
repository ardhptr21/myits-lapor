import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Report',
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    photos: [
      {
        type: String,
        trim: true,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Progress = mongoose.model('Progress', schema);
export type ProgressType = mongoose.InferSchemaType<typeof schema>;
