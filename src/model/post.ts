import { model, Schema } from "mongoose"
import { IPost } from "@model/abstract/post";

const postSchema: Schema = new Schema(
  {
    createBy: {
      type: String,
      required: true,
    },
    createDate: {
      type: Date,
      default: new Date()
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
    },
    views: {
      type: Number,
      default: 0
    },
    access: {
      type: Boolean,
      default: true
    }
  },
)

export default model<IPost>("Post", postSchema)