import prisma from "../db/prismaClient.js";
import path from "path";
import fs from 'fs'
import mime from 'mime'


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

  const fileDetailes = req.files.map((file) => ({
    filename: file.filename,
    originalName: file.originalname,
    id: file.filename.split(".")[0],
    path: `/uploads/Applicants/${file.filename}`,
  }));

  if (!fileDetailes || fileDetailes.length === 0) {
    return res.status(400).json({
      message: "Failed to fetch the file details",
      success: false,
      data: null,
    });
  }

  const addapplicants = await prisma.Applications.create({
    data: {
      name,
      email,
      phone,
      resume:fileDetailes,
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
    const getallapplications= await prisma.Applications.findMany({
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
    const getApplication= await prisma.Applications.findUnique({
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
//     const existingapplication = await prisma.Applications.findUnique({
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
//     const updatedapplication = await prisma.Applications.update({
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
    const deleteapplication= await prisma.Applications.delete({
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
    const jobrole = await prisma.Applications.findUnique({
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
  const { name,email,phone } = req.body;

  if (!jbroleId|| !applcationId) {
    return res.status(400).json({ message: "jobRoleId and applcationId is required", success: false });
  }

    const existingJobRole = await prisma.JobRole.findUnique({ where: { id: applcationId } });

    if (!existingJobRole) {
      return res.status(404).json({ message: "application not found", success: false });
    }

    let newImages = [];

    if (req.files && req.files.length > 0) {
      // Optional: remove old files from disk (careful!)
      for (const file of existingJobRole.resume) {
        const filePath = path.join(process.cwd(), file.path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // ⚠️ Deletes the file
        }
      }

      newImages = req.files.map((file) => ({
        filename: file.filename,
        originalName: file.originalname,
        id: file.filename.split(".")[0],
        path: `/uploads/Applicants/${file.filename}`,
      }));
    }

    const updatedjobrole = await prisma.JobRole.update({
      where: { id: applcationId,
        jbroleId
       },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
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