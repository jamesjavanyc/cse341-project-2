import { NextFunction, Request, Response } from "express";

const jwt = require("jsonwebtoken");

const secretKey = "secretKey";
export const generateRestToken =  function (payload:any):string {
  const token = jwt.sign({payload}, secretKey, {
    expiresIn: 60 * 60 * 365 * 24 ,
  });
  console.log(payload, "Token generated", token)
  return token
};

export const verifyRestToken = function (req:Request, res:Response, next:NextFunction):void {
  console.log("validating token")
  try {
    const token = req.cookies.token
    if(token && jwt.verify(token, secretKey)){
      console.log("Token validation success.")
      next()
    }else{
      res.json({ code: "403", msg: "Token expired or invalid." });
    }
  }catch (e) {
    res.json({ code: "403", msg: "Token expired or invalid." });
  }
};

export const logout = function ():void {
  console.log("Logout")

};
