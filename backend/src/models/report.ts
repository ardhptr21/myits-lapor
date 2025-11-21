import mongoose from 'mongoose';
import { ProgressType } from './progress';

const schema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'done'],
      default: 'pending',
    },
    photos: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

schema.virtual('progresses', {
  ref: 'Progress',
  localField: '_id',
  foreignField: 'report',
});

schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

export const Report = mongoose.model('Report', schema);
export type ReportType = mongoose.InferSchemaType<typeof schema> & {
  progresses?: (ProgressType & { _id: string })[];
};
