import {Request, Response} from "express";

const oauthLogin = (req:Request, res:Response):void =>{
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_OAUTH_ID}&redirect_uri=https://daycare.onrender.com/oauth-callback&scope=user:email`)
}

const oauthCallback = (req:Request, res:Response):void => {
  console.log(res)
}