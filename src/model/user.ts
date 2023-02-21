import { IUser } from "./abstract/user"
import { model, Schema } from "mongoose"

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique:true
    },

    name: {
      type: String,
      default:"New user"
    },

    password: {
      type: String
    },
  },
  { timestamps: true }
)

export default model<IUser>("User", userSchema)
