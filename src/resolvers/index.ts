import { IUser } from "@model/abstract/user";
import User from "../model/user";
import { generateRestToken } from "../utils/jwt";
import Post from "../model/post";
import { IPost } from "../model/abstract/post";

const bcrypt = require("bcrypt");

const resolvers = {

  Query: {
    // 登陆接口
    login: async (parent: any, param: any): Promise<String> => {
      try {
        let token: string = "";
        await User.findOne({ email: param.userDetails.email }).then(
          (res) => {
            if (res !== null) {
              token = generateRestToken(res.email);
            }
          }
        );
        console.log("Login:token is ", token);
        return token;
      } catch (e) {
        console.log(e);
        return "";
      }
    },

    //   注册接口 register + login return jwt token
    register: async (parent: any, param: any): Promise<String> => {
      try {
        let token: string = "";
        let password = await bcrypt.hash(param.userDetails.password, 10);
        await new User({
          email: param.userDetails.email,
          password: password,
          name: param.userDetails.name
        }).save().then(
          (res) => {
            if (res !== null) {
              token = generateRestToken(res.email);
            }
          }
        );
        console.log("Register: token is ", token);
        return token;
      } catch (e) {
        console.log(e);
        return "";
      }
    },

    //   oauth2 github登陆 返回redirect url
    oauth: async (): Promise<String> => {
      try {
        console.log("User login action with oauth.");
        return `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_OAUTH_ID}&redirect_uri=${process.env.GITHUB_OAUTH_DOMAIN}/auth/oauth-callback&scope=user:email`;
      } catch (e) {
        console.log(e);
        return "";
      }
    },
    allPublicPosts: async (): Promise<IPost[]> => {
      try {
        let posts: IPost[] = [];
        await Post.find({ access: true }).then(res => {
          posts = res;
        });
        return posts;
      } catch (e) {
        console.log(e);
        return [];
      }
    },
    allPosts: async (parent: any, param: any): Promise<IPost[]> => {
      try {
        let posts: IPost[] = [];
        await Post.find({ createBy: param.email }).then(res => {
          posts = res;
          console.log(posts)
        });
        return posts;
      } catch (e) {
        console.log(e);
        return [];
      }
    },
    createPost: async (parent: any, param: any):  Promise<number> => {
      try {
        await new Post(param.post).save().then(res=>{
          console.log("new post created")
        })
        return 1
      } catch (e) {
        console.log(e);
        return 0
      }
    },
    updatePost: async (parent: any, param: any):  Promise<number> => {
      try {
        Post.findByIdAndUpdate(param.post._id, param.post).then(res=>{
          console.log(" post updated")
        })
        return 1
      } catch (e) {
        console.log(e);
        return 0
      }
    },
    deletePost: async (parent: any, param: any):  Promise<number> => {
      try {
        Post.findByIdAndDelete(param._id).then(res=>{
          console.log(" post deleted")
        })
        return 1
      } catch (e) {
        console.log(e);
        return 0
      }
    },
  }
};

module.exports = resolvers;