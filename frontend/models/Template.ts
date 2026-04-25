import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITemplate extends Document {
  name: string;
  blocks: mongoose.Types.Array<Record<string, unknown>>;
  promptA?: string;
  blockCount?: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema = new Schema<ITemplate>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    blocks: {
      type: Schema.Types.Mixed,
      required: true,
    },
    promptA: {
      type: String,
    },
    blockCount: {
      type: Number,
    },
    userId: {
      type: String,
      default: 'anonymous',
    },
  },
  {
    timestamps: true,
  }
);

TemplateSchema.index({ userId: 1, createdAt: -1 });

const TemplateModel: Model<ITemplate> =
  mongoose.models.Template || mongoose.model<ITemplate>('Template', TemplateSchema);

export default TemplateModel;
