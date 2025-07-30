import prisma from "../../db/prismaClient.js";
import { generateToken } from "../../utils/generateToken.js";
import { hashPassword,comaprePassword } from "../../utils/managePassword.js";

const signup=async(req,res)=>{
    
    const{username,password,f_name,m_name,l_name}=req.body
    if(!username||!password||!f_name||!m_name||!l_name){
        return res.status(401).json({
            message:"User details is required",
            success:false,
            data:null
        })
    }
    const hashpassword= await hashPassword(password)
    const createuser= await prisma.user.create({
        data:{
            username,
            password:hashpassword,
            f_name,
            m_name,
            l_name
        }
    })
    return res.status(200).json({
        message:"User created",
        success:true,
        data:createuser
    })
}
const login=async(req,res)=>{
     //console.log("I got the Hit")
    const{username,password}=req.body

    if(!username||!password){
        return res.status(401).json({
            message:"usaername and password is required",
            success:false,
            data:null
        })
    }
      const userExists = await prisma.user.findUnique({
    where: { username }
  });
    if(!userExists){
        return res.status(400).json({
            message:"User do not Exists",
            success:false,
            data:null
        })
    }
    const normalizedPassword = typeof password === "number" ? password.toString() : password;

    const isPasswordValid= await comaprePassword(normalizedPassword,userExists.password)
    if(isPasswordValid){
        const token= generateToken(userExists)
        return res.status(200).json({
            message:"User login successfull",
            success:true,
            data:token
        })
    }
    return res.status(400).json({
        message:"Invalid credentials",
        success:false,
        data:null
    })
}
const resetPassword=async(req,res)=>{
    const{old_password,new_password}=req.body
    const {password,id}=req.user
    if(!old_password||!new_password){
        return res.status(401).json({
            message:"Fields are empty",
            success:false,
            data:null
        })
    }
    if(await comaprePassword(old_password,password)){
        const newPassword= await hashPassword(new_password)
        const updatePassword= await prisma.user.update({
            where:{id:id},
            data:{password:newPassword}
        })
        return res.status(200).json({
            message:"Password updated",
            success:true,
            data:updatePassword
        })
    }
    return res.status(400).json({
        message:"Eter correct old Password",
        success:false,
        data:null
    })
}
export{signup,login,resetPassword}