import mongoose, { Document, Schema } from "mongoose";

export interface ILead extends Document {
  name: string;
  email: string;
  phone: string;
  company: string;
  stage: "new" | "contacted" | "qualified" | "converted" | "lost";
  source: string;
  value?: number;
  notes?: string;
}

const leadSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    company: { type: String },
    stage: {
      type: String,
      enum: ["new", "contacted", "qualified", "converted", "lost"],
      default: "new",
    },
    source: { type: String },
    value: { type: Number },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ILead>("Lead", leadSchema);
