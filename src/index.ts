import { NextFunction, Request, Response } from "express";
import "express-async-error"
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./typeDef")
const resolvers = require("./resolvers")

const apolloServer = new ApolloServer({

  typeDefs,

  resolvers

});


dotenv.config();

const port: number = Number(process.env.SERVER_PORT) || 5000;
const app = express();
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger('dev'));

app.use("/rest",  require("./routes"))

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log('handler error...', err)
})


const mongooseOption = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};
mongoose.connect(process.env.MONGO_URI, mongooseOption)
  .then(async() => {
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
    app.listen(port, () => {
      console.log("Server start on port " + port);
    });
  })
  .catch((e:any) => {
      console.error(e);
    }
  );


