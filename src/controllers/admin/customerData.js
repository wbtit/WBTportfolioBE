import prisma from "../../db/prismaClient.js";

const addCustomerData=async(req,res)=>{
    const {name,email,phone,message}=req.body
    if(!email||!name||!phone||!message){
        res.status(400).json({
            message:"Fields are empty",
            data:null
        })
    }
    const customer= await prisma.CustomerData.create({
        data:{
            name,
            email,
            phone,
            message
        }
    })
    if(!customer){
        res.status(200).json({
            message:"Data recorded successfully",
            data:customer
        })
    }
}

const getAllCustomerData= async(req,res)=>{
    const userData= await prisma.CustomerData.findMany(
    )
    if(userData.length===0){
        res.status(200).json({
            message:"No users Data in the DB",
            data:userData
        })
    }
    res.status(200).json({
        message:"UserData fetched successfully",
        data:userData
    })
}
export{addCustomerData,getAllCustomerData}