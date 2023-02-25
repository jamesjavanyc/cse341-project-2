import { Request, Response } from "express";
import UserDao from "../model/user";
import { generateRestToken } from "../utils/jwt";

const axios = require("axios");
const bcrypt = require("bcrypt");

const oauthLogin = (req: Request, res: Response): void => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_OAUTH_ID}&redirect_uri=${process.env.GITHUB_OAUTH_DOMAIN}/auth/oauth-callback&scope=user:email`);
};

const oauthCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.query.code) {
      res.status(401).send("Unauthorized, access denied.");
    } else {
      const body = {
        client_id: process.env.GITHUB_OAUTH_ID, // 必须
        client_secret: process.env.GITHUB_OAUTH_SECRET, // 必须
        code: req.query.code // 必须,这个不用我们填写，当授权跳转后，会在/oauth-callback 自动添加code
      };
      const response = await axios.post(
        `https://github.com/login/oauth/access_token`,
        body
      );
      // 获取token
      const token = response.data.split("&")[0].substring(13);
      // 获取用户信息
      const emailRes = await axios({
        method: "get",
        url: "https://api.github.com/user/emails",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `token ${token}`
        }
      });
      //获取email
      let email;
      emailRes.data.map((emailInfo: any) => {
        if (emailInfo.primary) {
          email = emailInfo.email;
        }
      });
      //执行email登陆逻辑， 但是不需要密码
      if (email) {
        const user = await UserDao.findOne({ email: email });
        if (user) {
          console.log("User exist o auth");
          res.status(200).cookie("token", generateRestToken(user.email)).cookie("email",email).send();
        } else {
          console.log("User not exist o auth");
          const newUser = new UserDao({
            email: email
          });
          await newUser.save();
          console.log("Oauth new user created");
          res.status(200).cookie("token", generateRestToken(newUser.email)).cookie("email",email).send();
        }
      } else {
        res.status(401).send("Bad Credential. OAUTH AUTHORITY NOT ENOUGH TO GET EMAIL.");
      }
    }
  } catch (e) {
    res.status(500).send(e);
  }
};

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("start register");
    const email = req.body.email;
    const password = req.body.password;
    if (email && password) {
      const existUser = await UserDao.findOne({ email: email });
      if (existUser) {
        res.status(400).send("Email is already exists.");
        return;
      }
      const encrypted = await bcrypt.hash(password, 10);
      console.log("encrypted",encrypted);
      const newUser = new UserDao({
        email: email, password: encrypted
      });
      await newUser.save();
      console.log("register ok");
      res.status(200).cookie("token", generateRestToken(newUser.email)).cookie("email",email).send();
    } else {
      res.status(400).send("No enough information.");
    }
  } catch (e) {
    console.log(e)
    res.status(500).send("Server error.");
  }
};

const emailLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("email user login");
    const email = req.body.email;
    const password = req.body.password;
    if (email) {
      const user = await UserDao.findOne({ email: email });
      if (user) {
        console.log("User login with email found in db");
        if (user.password && bcrypt.compareSync(password, user.password)) {
          res.status(200).cookie("token", generateRestToken(user.email)).cookie("email",email).send();
        }
        if (!user.password) {
          res.status(200).cookie("token", generateRestToken(user.email)).cookie("email",email).send();
        }
      } else {
        console.log("User login with email not found in db", email);
        res.status(401).send("Bad Credential.");
      }
    } else {
      res.status(401).send("Email required.");
    }
  } catch (e) {
    console.log(e);
    res.status(401).send("Bad Credential.");
  }
};

module.exports = {
  oauthLogin,
  oauthCallback,
  emailLogin,
  register
};