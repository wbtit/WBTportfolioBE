import Prisma  from "../../db/prismaClient.js"
import { updateCloudinaryFiles } from "../../utils/updateCloudinaryFiles.js"
import { uploadFilesToCloudinary } from "../../utils/uploadFilesToCloudinary.js"


const addpost=async(req,res)=>{
    const{title,content}=req.body
    if(!title||!content){
        return res.status(400).json({
            message:"Feilds are empty",
            data:null
        })
    }

    const uploadFiles= await uploadFilesToCloudinary(req.files,"blogFiles")
    const successUploads=  uploadFiles.filter(detail=>detail!==null)
    const post= await Prisma.post.create({
        data:{
            title,
            content,
            files:successUploads
        }
    })
    return res.status(200).json({
        message:"Post created successfully",
        data:post
    })
}

const getPosts=async(req,res)=>{
    const posts= await prisma.post.findMany({
        include:{
            comments:true,
            likes:true,
            createdAt:true
        }
    })
    return res.status(200).json({
        message:"posts fetched successfully",
        data:posts
    })
}


const getPostById=async(req,res)=>{
    const{postId}=req.params
    if(!postId){
        return res.status(400).json({
            message:"PostId is required",
            data:null
        })
    }
    const postById= await prisma.post.find({
        where:{id:postId},
        include:{
            comments:true,
            categoryType:true,
            likes:true,
            createdAt:true
        }
    })
    return res.status(200).json({
        message:"Post fetched successfully",
        data:postById
    })
}

const updatePost=async(req,res)=>{
    const{postId}=req.params
    const {title,content,}=req.body

    if(!postId){
        return res.status(400).json({
            message:"PostId is required",
            data:null
        })
    }
    const existingPost= await prisma.post.findUnique({where:{id:postId}})

    if(!existingPost){
        return res.status(404).json({message:"Post not found",data:null})
    }
    let newImages=[];
    if (req.files && req.files.length > 0) {
    newImages = await updateCloudinaryFiles(existingPost.files, req.files, "blog_files", "uploads/blogFiles");

    if (newImages.length === 0) {
      console.warn("No images were uploaded successfully.");
    }
  }
    const updatePost= await prisma.post.update({
        where:{id:postId},
        data:{
            ...(title && {title}),
            ...(content && {content}),
            ...(newImages.length >0 && {files:newImages}),
        }
    })
    return res.status(200).json({
        message:"Post updated successfully",
        data:updatePost
    })
    
}

const deletePost= async(req,res)=>{
    const{ postId}=req.params
    if(!postId){
        return res.status(400).json({
            message:"Postid is required",
            data:null
        })
    }
    const deletePost= await prisma.post.delete({
        where:{id:postId}
    })
    return res.status(200).json({
        message:"Post got deleted successfully",
        data:deletePost
    })
}

const likePost=async(req,res)=>{
    const{postId}=req.params
    
    if(!postId ||!likes){
        return res.status(400).json({
            message:"Fields are empty",
            data:null
        })
    }
    const likedPost= await prisma.post.update({
        where:{id:postId},
        data:{
            likes:{increment:1}
        }
    })
    return res.status(200).json({
        message:"Post liked successfully",
        data:likedPost
    })
}

export{
    addpost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost
}