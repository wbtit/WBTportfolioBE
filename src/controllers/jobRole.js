import prisma from "../db/prismaClient.js";
import path from "path";
import fs from 'fs'
import mime from 'mime'


const addJobRole = async (req, res) => {
  const { Role, location, type, qualification, status } = req.body;

  if (!Role || !location || !type || !qualification || status === undefined) {
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
    path: `/uploads/JobRoleFiles/${file.filename}`,
  }));

  if (!fileDetailes || fileDetailes.length === 0) {
    return res.status(400).json({
      message: "Failed to fetch the file details",
      success: false,
      data: null,
    });
  }

  const addjobrole = await prisma.jobRole.create({
    data: {
      Role,
      location,
      type,
      qualification,
      status: status === "true" || status === true, // in case it comes as string
      jd: fileDetailes,
    },
  });

  return res.status(200).json({
    message: "Job role added successfully",
    success: true,
    data: addjobrole,
  });
};

const getAllJobRole=async(req,res)=>{
    const getalljobrole= await prisma.JobRole.findMany({
        include:{
           applications:true 
        }
    })
    return res.status(200).json({
        message:"Fetched all jobroles",
        success:true,
        data:getalljobrole
    })
}

const getJobRoleById= async(req,res)=>{
    const {jobRoleId}=req.params
    if(!jobRoleId){
        return res.status(401).json({
            message:"jobRoleId is required",
            success:false,
            data:null
        })
    }
    const getJobRole= await prisma.JobRole.findUnique({
        where:{id:jobRoleId},
        include:{
           applications:true 
        }
    })
    return res.status(200).json({
        message:"Fetched the jobRole by Id",
        success:true,
        data:getJobRole
    })
}
// const updateJobRole = async (req, res) => {
//   const { jobRoleId } = req.params;

//   if (!jobRoleId) {
//     return res.status(400).json({
//       message: "jobRoleId is required",
//       success: false,
//       data: null,
//     });
//   }
//  
//     // Check if project exists
//     const existingJobRole = await prisma.JobRole.findUnique({
//       where: { id: jobRoleId },
//     });

//     if (!existingJobRole) {
//       return res.status(404).json({
//         message: "JobRole not found",
//         success: false,
//         data: null,
//       });
//     }

//     // Perform update
//     const updatedJobRole = await prisma.JobRole.update({
//       where: { id: jobRoleId },
//       data: req.body,
//     });

//     return res.status(200).json({
//       message: "JobRole updated successfully",
//       success: true,
//       data: updatedJobRole,
//     });
// };


const deleteJobRole=async(req,res)=>{
     const {jobRoleId}=req.params
    if(!jobRoleId){
        return res.status(401).json({
            message:"jobRoleId is required",
            success:false,
            data:null
        })
    }
    const deleteJobRole= await prisma.JobRole.delete({
        where:{id:jobRoleId},
    })
    return res.status(200).json({
        message:"deleted the JobRole by Id",
        success:true,
        data:deleteJobRole
    })
}


const viewJobrolefiles = async (req, res) => {
  const { id, fid } = req.params;
    const jobrole = await prisma.JobRole.findUnique({
      where: { id },
    });

    if (!jobrole) {
      return res.status(404).json({ message: "jobrole not found" });
    }

    const fileObject = jobrole.file.find((file) => file.id === fid); // ✅ images not files

    if (!fileObject) {
      return res.status(404).json({ message: "File not found in jobrole" });
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


const updateJobRoleWithFile = async (req, res) => {
  const { jobRoleId } = req.params;
  const { Role,location,type,qualification,status } = req.body;

  if (!jobRoleId) {
    return res.status(400).json({ message: "jobRoleId is required", success: false });
  }

    const existingJobRole = await prisma.JobRole.findUnique({ where: { id: jobRoleId } });

    if (!existingJobRole) {
      return res.status(404).json({ message: "JobRole not found", success: false });
    }

    let newImages = [];

    if (req.files && req.files.length > 0) {
      // Optional: remove old files from disk (careful!)
      for (const file of existingJobRole.jd) {
        const filePath = path.join(process.cwd(), file.path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // ⚠️ Deletes the file
        }
      }

      newImages = req.files.map((file) => ({
        filename: file.filename,
        originalName: file.originalname,
        id: file.filename.split(".")[0],
        path: `/uploads/JobRoleFiles/${file.filename}`,
      }));
    }

    const updatedjobrole = await prisma.JobRole.update({
      where: { id: jobRoleId },
      data: {
        ...(Role && { Role }),
        ...(location && { location }),
        ...(type && { type }),
        ...(qualification && { qualification}),
        ...(typeof status !== "undefined" && { status: status === "true" || status === true }),
        ...(newImages.length > 0 && { jd: newImages }), // only update if new files uploaded
      },
    });

    return res.status(200).json({
      message: "portfoliowork updated successfully",
      success: true,
      data: updatedjobrole,
    });
 
};


export {
    addJobRole,
    getAllJobRole,
    getJobRoleById,
    // updateJobRole,
    viewJobrolefiles,
    updateJobRoleWithFile,
    deleteJobRole
}