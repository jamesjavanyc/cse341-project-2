import {Request, Response} from "express";
import axios from "axios";

const oauthLogin = (req:Request, res:Response):void =>{
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_OAUTH_ID}&redirect_uri=${process.env.GITHUB_OAUTH_DOMAIN}/auth/oauth-callback&scope=user:email`)
}

const oauthCallback = async(req:Request, res:Response):Promise<void> => {
  try {
    if (!req.query.code) {
      res.status(401).send("Unauthorized, access denied.")
    } else {
      const body = {
        client_id: process.env.GITHUB_OAUTH_ID, // 必须
        client_secret: process.env.GITHUB_OAUTH_SECRET, // 必须
        code: req.query.code, // 必须,这个不用我们填写，当授权跳转后，会在/oauth-callback 自动添加code
      };
      const response = await axios.post(
        `https://github.com/login/oauth/access_token`,
        body,
      );
      // 获取token
      const token = response.data.split("&")[0].substring(13)
      // 获取用户信息
      const emailRes = await axios({
        method: "get",
        url: "https://api.github.com/user/emails",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `token ${token}`,
        }
      });
      //获取email
      let email;
      emailRes.data.map((emailInfo: any) => {
        if (emailInfo.primary) {
          email = emailInfo.email
        }
      })
      //执行email登陆逻辑， 但是不需要密码
    }
  }catch (e){
    res.status(500).send("Server error.")
  }
}

module.exports={
  oauthLogin,
  oauthCallback
}