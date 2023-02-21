import { Request, Response } from "express";
import PostDao from "@model/post";

const getAllPublicPosts = async (req: Request, res: Response) => {
  try {
    const posts = await PostDao.find({ access: true });
    res.status(200).json(posts);
  } catch (e) {
    res.status(500).send("ERROR!");
  }
};

const getAllPosts = async (req: Request, res: Response) => {
  try {
    if (!req.cookies.email) {
      res.status(401).send("Please login.");
      return;
    }
    const posts = await PostDao.find({ createBy: req.cookies.email });
    res.status(200).json(posts).send();
  } catch (e) {
    res.status(500).send("ERROR!");
  }
};

const updatePosts = async (req: Request, res: Response) => {
  try {
    if (req.body._id) {
      await PostDao.findByIdAndUpdate(req.body._id, {
        createBy: req.cookies.email,
        title: req.body.title,
        body: req.body.body,
        tags: req.body.tags,
        access: req.body.access
      });
      res.status(204).send();
    } else {
      res.status(400).send("ID!!!!");
    }
  } catch (e) {
    res.status(500).send("ERROR!");
  }

};

const createPosts = async (req: Request, res: Response) => {
  try {
    const newPost = new PostDao({
      createBy: req.cookies.email,
      title: req.body.title,
      body: req.body.body,
      tags: req.body.tags,
      access: req.body.access
    });
    await newPost.save();
    res.status(200).send(newPost._id);
  } catch (e) {
    res.status(500).send("ERROR!");
  }
};

const deletePosts = async (req: Request, res: Response) => {
  try {
    if (!req.query.id) {
      res.status(400).send("ID!!!!");
      return;
    } else {
      await PostDao.findByIdAndDelete(req.query.id)
      res.status(200).send();
    }
  } catch (e) {
    res.status(500).send("ERROR!");
  }

};