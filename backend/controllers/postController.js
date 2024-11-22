import User from "../models/userModel.js";
import { Response } from "../utils/response.js"
import { message } from "../utils/message.js";
import Post from "../models/postModel.js";
import cloudinary from "cloudinary";

export const createPost = async (req, res) => {
    try {
        const { image,caption,location } = req.body;

        if(!caption)
        {
            req.Response(res,400,false,message.missingFieldsMessage);
        }

        if(!image){
            req.response(res,400,false,message.imageFieldMessage);
        }

        let imageUpload=await cloudinary.uploadImage(image,{
            folder: 'posts'
        })

        let post= await Post.create({
            image: {
                public_id: imageUpload.public_id,
                url: imageUpload.url
            },
            caption,
            location
        })

        post.owner = req.user._id;
        await post.save();

        let user = await User.findById(req.user._id);
        user.posts.unshift(post._id);

        Response(res,201,true,message.postCreatedMessage,post);

    } catch (error) {
        Response(res, 500, false, error.message);
    }
}