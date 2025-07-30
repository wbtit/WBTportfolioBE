import prisma, { Prisma } from "../../db/prismaClient.js"
import { uploadFilesToCloudinary } from "../../utils/uploadFilesToCloudinary.js"

const addpost=async(req,res)=>{
    const{title,content}=req.body
    if(!title||!content){
        return res.status(400).json({
            message:"Feilds are empty",
            data:null
        })
    }

    const uploadFiles= await uploadFilesToCloudinary(req.files,"blog_files")
    const successUploads=  uploadFiles.filter(detail=>detail!==null)
    const post= await Prisma.Post.create({
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
    const posts= await prisma.Post.findMany({
        include:{
            comments:true,
            categoryType:true,
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
    const postById= await prisma.Post.find({
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
    const 
}