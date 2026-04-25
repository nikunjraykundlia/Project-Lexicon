import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHistory extends Document {
  promptA: string;
  promptB?: string;
  blocks: mongoose.Types.Array<Record<string, unknown>>;
  blockCount?: number;
  compositionFingerprint?: string;
  userId: string;
  createdAt: Date;
}

const HistorySchema = new Schema<IHistory>({
  promptA: {
    type: String,
    required: true,
  },
  promptB: {
    type: String,
  },
  blocks: {
    type: Schema.Types.Mixed,
  },
  blockCount: {
    type: Number,
  },
  compositionFingerprint: {
    type: String,
  },
  userId: {
    type: String,
    default: 'anonymous',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000, // 30 days TTL in seconds
  },
});

const HistoryModel: Model<IHistory> =
  mongoose.models.History || mongoose.model<IHistory>('History', HistorySchema);

export default HistoryModel;
