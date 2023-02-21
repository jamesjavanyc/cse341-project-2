import { NextFunction, Request, Response } from "express";

const jwt = require("jsonwebtoken");

const secretKey = "secretKey";
// 生成token
export const generateToken = function (payload:any):string {
  const token = jwt.sign({payload}, secretKey, {
    expiresIn: 60 * 60 * 365 * 24 ,
  });
  console.log(payload, "Token generated")
  return token
};

// 验证token
export const verifyToken = function (req:Request, res:Response, next:NextFunction):void {
  console.log("validating token")
  try {
    const token = req.cookies.token
    console.log(token)
    if(token && jwt.verify(token, secretKey)){
      next()
    }else{
      res.json({ code: "403", msg: "Token expired or invalid." });
    }
  }catch (e) {
    res.json({ code: "403", msg: "Token expired or invalid." });
  }
};