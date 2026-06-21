import { Schema, model } from "mongoose";

const templeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
});

templeSchema.index(
  {
    name: 1,
    branch: 1,
    city: 1,
  },
  {
    unique: true,
  },
);

export const Temple = model("Temple", templeSchema);
