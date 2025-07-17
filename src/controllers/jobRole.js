import prisma from "../db/prismaClient.js";
import path from "path";
import fs from 'fs'
import mime from 'mime'
import { cloudinary } from "../config/loudinaryConfig.js";



const addJobRole = async (req, res) => {
  const { Role, location, type, qualification, status } = req.body;

  if (!Role || !location || !type || !qualification || status === undefined) {
    return res.status(401).json({
      message: "Fields are empty",
      success: false,
      data: null,
    });
  }

  const uplooadPromises=[]

  req.files.forEach(file=>{
    const filePath=file.path
    uplooadPromises.push(
      cloudinary.uploader.upload(filePath,{
        folder:'jobRole_files',
        quality:'auto',
        fetch_format:'auto',
      }).then(result=>{
        return {
          ublic_id:result.public_id,
              secureUrl:result.secure_url, 
              fileName:file.filename, 
              originalName:file.originalname,
              path:`/uploads/JobRoleFiles/${file.filename}` 
        }
      }).catch(error=>{
        console.error("Cloudinary upload failed for file:", file.originalname, error)
                return null;
      })
    )
  })
  const uploadFiles= await Promise.all(uplooadPromises)
  const successfullUploads= uploadFiles.filter(detail=>detail!==null)

  const addjobrole = await prisma.jobRole.create({
    data: {
      Role,
      location,
      type,
      qualification,
      status: status === "true" || status === true, // in case it comes as string
      jd: successfullUploads,
    },
  });

  return res.status(200).json({
    message: "Job role added successfully",
    success: true,
    data: addjobrole,
  });
};

const getAllJobRole=async(req,res)=>{
    const getalljobrole= await prisma.jobRole.findMany({
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
    const getJobRole= await prisma.jobRole.findUnique({
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
//     const existingJobRole = await prisma.jobRole.findUnique({
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
//     const updatedJobRole = await prisma.jobRole.update({
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
    const deleteJobRole= await prisma.jobRole.delete({
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
    const jobrole = await prisma.jobRole.findUnique({
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

    const existingJobRole = await prisma.jobRole.findUnique({ where: { id: jobRoleId } });

    if (!existingJobRole) {
      return res.status(404).json({ message: "JobRole not found", success: false });
    }

    let newImages = [];

    if (req.files && req.files.length > 0) {
      // Optional: remove old files from disk (careful!)
      const deletePromises=existingJobRole.jd.map(async(file)=>{
        if(file.public_id){
          try {
            await cloudinary.uploader.destroy(file.public_id)
          } catch (error) {
            console.error(`Failed to delete image from the cloudinary public_id:${file.public_id}`)
          }
        }
        if(file.path){
          const localFilePath=path.join(process.pwd(),file.path)
          if(fs.existsSync(localFilePath)){
            try {
              fs.unlinkSync(localFilePath)
            } catch (error) {
              console.error(`Failed to remove file from the Server with path : ${localFilePath}`)
            }
          }
        }
      })
      await Promise.all(deletePromises)

      const uploadPromises=req.jd.map(async(file)=>{
        const filepath=file.path
        try {
          const result = await cloudinary.uploader.upload(filepath,{
            folder:'jobRole_files'
          })
          return {
            public_id: result.public_id,
            secureUrl: result.secure_url,
            fileName: file.filename,
            originalName: file.originalname,
            path: `/uploads/jobRoleFiles/${file.filename}`
          }
        } catch (error) {
          console.error("Cloudinary upload failed for file:", file.originalname, error);
          return null
        }
      })

      const uploadedImages = await Promise.all(uploadPromises);
        newImages = uploadedImages.filter(detail => detail !== null);

        if(newImages.length === 0 && req.files.length>0){
          console.error("No new images were successfully uploaded to Cloudinary.");
        }
      if (newImages.length === 0 && req.files.length > 0) {
            console.error("No new images were successfully uploaded to Cloudinary.");
        }
    }

    const updatedjobrole = await prisma.jobRole.update({
      where: { id: jobRoleId },
      data: {
        ...(Role && { Role }),
        ...(location && { location }),
        ...(type && { type }),
        ...(qualification && { qualification}),
        ...(typeof status !== "undefined" && { status: status === "true" || status === true }),
        ...(newImages.length > 0 && { jd: newImages }), // only update if new files uploaded
      },
      include:{
         applications:true 
      }
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