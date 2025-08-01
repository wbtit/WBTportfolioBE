import prisma from "../../db/prismaClient.js";
import path from "path";
import fs from 'fs'
import mime from 'mime'
import { cloudinary } from "../../config/cloudinaryConfig.js";
import { uploadFilesToCloudinary } from "../../utils/uploadFilesToCloudinary.js";


const addApplicant = async (req, res) => {
  const { name,email,phone } = req.body;
  const{jbroleId}=req.params

  if (!name||!email||!phone) {
    return res.status(401).json({
      message: "Fields are empty",
      success: false,
      data: null,
    });
  }

  
  const uploadeFiles= await uploadFilesToCloudinary(req.files,"Applicants")
    const suuccessfullUploades=uploadeFiles.filter(detail=>detail!==null)

    if(suuccessfullUploades.length===0){
      return res.status(500).json({
            message: "Failed to upload images to Cloudinary.",
            success: false,
            data: null
        });
    }

  const addapplicants = await prisma.applications.create({
    data: {
      name,
      email,
      phone,
      resume:suuccessfullUploades,
      jbroleId
    },
  });

  return res.status(200).json({
    message: "application added successfully",
    success: true,
    data: addapplicants,
  });
};

const getAllApplicationByJD=async(req,res)=>{
    const{jbroleId}=req.params
    const getallapplications= await prisma.applications.findMany({
        where:{
            jbroleId
        }
    })
    return res.status(200).json({
        message:"Fetched all Applications",
        success:true,
        data:getallapplications
    })
}

const getapplicationsById= async(req,res)=>{
    const {jbroleId,applcationId}=req.params
    if(!jbroleId|| !applcationId){
        return res.status(401).json({
            message:"jobRoleId and applcationId is required",
            success:false,
            data:null
        })
    }
    const getApplication= await prisma.applications.findUnique({
        where:{
            id:applcationId,
            jbroleId
        },
    })
    return res.status(200).json({
        message:"Fetched the application by Id",
        success:true,
        data:getApplication
    })
}
// const updateapplication = async (req, res) => {
//   const { jobRoleId } = req.params;
    //  const {applcationId}=req.params

//   if (!jobRoleId || !applcationId) {
//     return res.status(400).json({
//       message: "jobRoleId and applcationId is required",
//       success: false,
//       data: null,
//     });
//   }
//  
//     // Check if project exists
//     const existingapplication = await prisma.applications.findUnique({
//       where: { id: applcationId ,
//                 jobRoleId         
//      },
//     });

//     if (!existingapplication) {
//       return res.status(404).json({
//         message: "JobRole not found",
//         success: false,
//         data: null,
//       });
//     }

//     // Perform update
//     const updatedapplication = await prisma.applications.update({
//       where: { id: applcationId,
//              jobRoleId
//  },
//       data: req.body,
//     });

//     return res.status(200).json({
//       message: "application updated successfully",
//       success: true,
//       data: updatedapplication,
//     });
// };


const deleteApplication=async(req,res)=>{
     const {jbroleId,applcationId}=req.params
    if(!jbroleId ||! applcationId){
        return res.status(401).json({
            message:"jobRoleId and applcationId is required",
            success:false,
            data:null
        })
    }
    const deleteapplication= await prisma.applications.delete({
        where:{id:applcationId,
            jbroleId
        },
    })
    return res.status(200).json({
        message:"deleted the application by Id",
        success:true,
        data:deleteapplication
    })
}


const viewapplicationfiles = async (req, res) => {
  const { id, fid } = req.params;
    const jobrole = await prisma.applications.findUnique({
      where: { id },
    });

    if (!jobrole) {
      return res.status(404).json({ message: "application not found" });
    }

    const fileObject = jobrole.file.find((file) => file.id === fid); // ✅ images not files

    if (!fileObject) {
      return res.status(404).json({ message: "File not found in application" });
    }

    const __dirname = path.resolve();
    const filePath = path.join(__dirname, fileObject.path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    const mimeType = mime.getType(filePath);
    res.setHeader("Content-Type", mimeType || "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${fileObject.originalName}"`
    );

    fs.createReadStream(filePath).pipe(res);
  
};


const updateApplicationWithFile = async (req, res) => {
  const { jbroleId,applcationId } = req.params;
  const { name,email,phone,status } = req.body;

  if (!jbroleId|| !applcationId) {
    return res.status(400).json({ message: "jobRoleId and applcationId is required", success: false });
  }

    const existingJobRole = await prisma.applications.findUnique({ where: { id: applcationId,jbroleId:jbroleId } });

    if (!existingJobRole) {
      return res.status(404).json({ message: "application not found", success: false });
    }

    let newImages = [];
     if (req.files && req.files.length > 0) {
    newImages = await updateCloudinaryFiles(existingportfoliowork.resume, req.files, "resume_files", "uploads/portfolioWorkFiles");

    if (newImages.length === 0) {
      console.warn("No images were uploaded successfully.");
    }
  }
    const updatedjobrole = await prisma.applications.update({
      where: { id: applcationId,
        jbroleId
       },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(status && {status}),
        ...(newImages.length > 0 && { resume: newImages }), // only update if new files uploaded
      },
    });

    return res.status(200).json({
      message: "Application updated successfully",
      success: true,
      data: updatedjobrole,
    });
 
};


export {
    addApplicant,
    getAllApplicationByJD,
    getapplicationsById,
    // updateapplication,
    viewapplicationfiles,
    updateApplicationWithFile,
    deleteApplication
}