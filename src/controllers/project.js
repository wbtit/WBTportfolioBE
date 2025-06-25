import prisma from "../db/prismaClient";

const addproject=async(req,res)=>{
    const{title,description,location,type,technologyused,status}=req.body
    if(!title||!description||!location||!type||!technologyused||!status){
        return res.status(401).json({
            message:"Feilds are empty",
            success:false,
            data:null
        })
    }
    const fileDetailes= req.images.map((file)=>({
        filename:file.filename,
        originalName:file.originalName,
        id:file.filename.split(".")[0],
        path:`/public/ProjectImages/${file.filename}`
    }))
    if(!fileDetailes){
        return res.status(400).json({
            message:"failed to fetch the file detailes",
            success:false,
            data:null
        })
    }
    const addProject= await prisma.project.create({
        data:{
            title,description,location,type,technologyused,status,fileDetailes
        }
    })
    return res.status(200).json({
        message:"Project added successfully",
        success:true,
        data:addProject
    })
}
const getAllProjects=async(req,res)=>{
    const getallprojects= await prisma.project.findMany()
    return res.status(200).json({
        message:"Fetched all projects",
        success:true,
        data:getallprojects
    })
}

const getProjectById= async(req,res)=>{
    const {projectId}=req.params
    if(!projectId){
        return res.status(401).json({
            message:"projectId is required",
            success:false,
            data:null
        })
    }
    const getProject= await prisma.project.findUnique({
        where:{id:projectId},
    })
    return res.status(200).json({
        message:"Fetched the project by Id",
        success:true,
        data:getProject
    })
}
const updateProject= async(req,res)=>{
     const {projectId}=req.params
    if(!projectId){
        return res.status(401).json({
            message:"projectId is required",
            success:false,
            data:null
        })
    }
    const updateProject= await prisma.project.update({
        where:{id:projectId},
        data:req.body
    })
    return res.status(200).json({
        message:"updated the project by Id",
        success:true,
        data:updateProject
    })
}

const deleteProject=async(req,res)=>{
     const {projectId}=req.params
    if(!projectId){
        return res.status(401).json({
            message:"projectId is required",
            success:false,
            data:null
        })
    }
    const deleteProject= await prisma.project.delete({
        where:{id:projectId},
    })
    return res.status(200).json({
        message:"Fetched the project by Id",
        success:true,
        data:deleteProject
    })
}
export {
    addproject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
}