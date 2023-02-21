import { Document } from "mongoose"
import { IUser } from "@model/abstract/user";

export interface IPost extends Document {
  createBy: String
  createDate: Date
  title: String

  body: String

  tags: String[]

  views: Number

  access: Boolean

}