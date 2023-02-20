import { IUser } from "./types/document"
import { model, Schema } from "mongoose"

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export default model<IUser>("User", userSchema)
