import prisma from "../../db/prismaClient.js"

const addComment=async(req,res)=>{
    const {postId}=req.params
    const{content,parentId}=req.body
    if(!postId){
        return res.status(400).json({
            message:"PostId is required",
            data:null
        })
    }
    const comment= await prisma.comment.create({
        data:{
            content,
            post:{connect:{id:postId}},
            parentComment:{connect:{id:parentId||null}}
        }
    })
    return res.status(200).json({
        message:"comment added successfully",
        data:comment
    })
}

const getCommentsOfPost=async(req,res)=>{
    const{postId}=req.params
    if(!postId){
        return res.status(400).json({
            message:"PostId is required",
            data:null
        })
    }
    const comments= await prisma.comment.findMany({
        where:{
            postId:postId
        },
        include:{
            childComments:true
        }
    })
    return res.status(200).json({
        message:"comments fetched for the post",
        data:comments
    })
}

const updateComment=async(req,res)=>{
    const{commentId}=req.params
    const{content}=req.body
    if(!commentId){
        return res.status(400).json({
            message:"commentId is required",
            data:null
        })
    }
    const updatedComment= await prisma.comment.update({
        where:{id:commentId},
        data:{
            content:content
        }
    })
    return res.status(200).json({
        message:"comment updated successfully",
        data:updatedComment
    })
}

const deleteComment= async(req,res)=>{
    const{commentId}=req.params
    if(!commentId){
        return res.status(400).json({
            message:"commentId is required",
            data:null
        })
    }
    const deletedComment= await prisma.comment.delete({
        where:{id:commentId}
    })
    return res.status(200).json({
        message:"comment deleted successfully",
        data:deletedComment
    })
}

const likeComment= async(req,res)=>{
    const{commentId}=req.params
    if(!commentId){
        return res.status(400).json({
            message:"commentId is required",
            data:null
        })
    }
    const likedComment= await prisma.comment.update({
        where:{
            id:commentId
        },
        data:{
            likes:{increment:1}
        }
    })
}
export{
    addComment,
    getCommentsOfPost,
    deleteComment,
    updateComment,
    likeComment,
}