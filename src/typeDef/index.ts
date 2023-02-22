const typeDefs = `

type Query {
  login(userDetails: User): String
  oauth: String
  register(userDetails: User): String
  allPublicPosts: [Post]
  allPosts(email:String): [Post]
  createPost(post:PostIn): Int
  updatePost(post:PostIn): Int
  deletePost(id:String): Int
}

input User{
  email: String!
  name: String
  password: String
}

type Post{
  _id:String
  createBy: String!
  createDate: String
  title: String!
  body: String!
  tags: [String]
  access: Boolean
  views: Int
}

input PostIn{
  _id:String
  createBy: String!
  title: String!
  body: String!
  tags: [String]
  access: Boolean
}


`;

module.exports = typeDefs;