import { Response } from "../utils/response.js";
import cloudinary from "cloudinary";
import { message } from "../utils/message.js";
import User from "../models/userModel.js";
import Post from "../models/postModel.js"
export const createPost = async (req, res) => {
  try {
    //parsing body data
    const { image, caption, location, mentions } = req.body;

    //check body data
    if (!caption) {
      return Response(res, 400, false, message.missingFieldsMessage);
    }
    if (!image) {
      return Response(res, 400, false, message.imageMissingMessage);
    }
    //upload image
    const imageResult = await cloudinary.v2.uploader.upload(image, {
      folder: "posts",
    });

    //create post
    const post = await Post.create({
      image: {
        public_id: imageResult.public_id,
        url: imageResult.secure_url,
      },
      caption,
      location,
      mentions,
      owner: req.user._id,
    });
    //add post in users post array

    const user = await User.findById(req.user._id);
    user.posts.unshift(post._id);
    await user.save();
    //send Response
    return Response(res, 201, true, message.postCreatedMessage);
  } catch (error) {
    Response(res, 500, false, error.message);
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const  posts=await Post.find().populate('owner','username, firstName, avatar ');
    if(posts.length===0){
        Response(res, 404,false, message.postsNotFoundMessage);
    }
    Response(res,200,true,message.postsFoundMessage,posts);

  } 
  catch (error) {
    Response(res, false, 500, error.message);
  }
};
export const getPostsById = async (req, res) => {
  try {
    const { id } = req.params;
    //find post
    const post=await Post.findById(id).populate('owner','username firstName,avatar')

    if (!post) return  Response(res, 404, message.postsNotFoundMessage);
    Response(res,200,true,message.postsFoundMessage,post)

  }
   catch (error) {
    Response(res, false, 500, error.message);
  }
};
export const getMyPosts = async (req, res) => {
  try {
    const posts=await Post.find({owner:req.user._id}).populate('owner','username firstName ,avatar')
    if(posts.length===0){
        return   Response(res, 404, message.postsNotFoundMessage); 
    }
    Response(res,200,true,message.postsFoundMessage,posts)
  } catch (error) {
    Response(res, false, 500, error.message);
  }
};
