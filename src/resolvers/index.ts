import User from "../model/user";
import { generateRestToken } from "../utils/jwt";
import Post from "../model/post";
import { IPost } from "../model/abstract/post";
import {logout} from "../utils/jwt";

const bcrypt = require("bcrypt");

const tokenRepo: string[] = []

const resolvers = {

  Query: {
    // 登陆接口
    login: async (parent: any, param: any): Promise<String> => {
      try {
        if(!param.userDetails.email) return "Email is required."
        let token: string = "";
        await User.findOne({ email: param.userDetails.email }).then(
          (res) => {
            if (res !== null) {
              token = generateRestToken(res.email);
              tokenRepo.push(token)
              setTimeout(()=>{
                tokenRepo.splice(tokenRepo.indexOf(token), 1)
              }, 1000 * 30);
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
    logout: async(): Promise<String> => {
      try{
        logout()
        return "Logout success."
      }catch (e) {
        return "Logout error"
      }
    },

    //   注册接口 register + login return jwt token
    register: async (parent: any, param: any): Promise<String> => {
      try {
        if(!param.userDetails.email) return "Email is required."
        if(!param.userDetails.password) return "Password is required."
        if(param.userDetails.password.length> 10 ||  param.userDetails.password.length < 5) return "Password length should be from 5 - 10."
        let password = await bcrypt.hash(param.userDetails.password, 10);
        if( await User.findOne({email: param.userDetails.email})) return "Email exists in database"
        let user = await new User({
          email: param.userDetails.email,
          password: password,
          name: param.userDetails.name
        })
        let token = generateRestToken(user.email)
        tokenRepo.push(token)
        setTimeout(()=>{
          tokenRepo.splice(tokenRepo.indexOf(token), 1)
        }, 1000 * 30);
        return token
      } catch (e) {
        return "Error";
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
    createPost: async (parent: any, param: any):  Promise<String> => {
      try {
        if(!param.post)return "Post cannot be empty"
        if(!param.post.title)return "Title cannot be empty"
        if(!param.post.body)return "Body cannot be empty"
        await new Post(param.post).save().then(res=>{
          console.log("new post created")
        })
        return "Success"
      } catch (e) {
        console.log(e);
        return "Failed"
      }
    },
    updatePost: async (parent: any, param: any):  Promise<String> => {
      try {
        if(!param._id) return "ID is required."
        Post.findByIdAndUpdate(param.post._id, param.post).then(res=>{
          console.log(" post updated")
        })
        return "Success"
      } catch (e) {
        console.log(e);
        return "Failed"
      }
    },
    deletePost: async (parent: any, param: any):  Promise<String> => {
      try {
        if(!param._id) return "ID is required."
        Post.findByIdAndDelete(param._id).then(res=>{
          console.log(" post deleted")
        })
        return "Success"
      } catch (e) {
        console.log(e);
        return "Failed"
      }
    },
  }
};

module.exports = resolvers;