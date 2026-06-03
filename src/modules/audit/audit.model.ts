import { Schema, Types, model } from "mongoose";

const auditLogSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      default: null,
    },
    role: {
      type: String,
      default: "Guest",
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    resource: {
      type: String,
      required: true,
      trim: true,
    },
    resourceId: {
      type: Types.ObjectId,
      default: null,
    },
    method: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    ip: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

auditLogSchema.index({ createdAt: -1 });
export const AuditLog = model("AuditLog", auditLogSchema);
