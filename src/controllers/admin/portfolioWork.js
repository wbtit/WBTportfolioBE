import prisma from "../../db/prismaClient.js";
import path from "path";
import fs from 'fs'
import mime from 'mime'
import { uploadFilesToCloudinary } from "../../utils/uploadFilesToCloudinary.js";


const addportfolioWork=async(req,res)=>{
    const{title,description,status}=req.body
    if(!title||!description){
        return res.status(401).json({
            message:"Feilds are empty",
            success:false,
            data:null
        })
    }
    const uploadeFiles= await uploadFilesToCloudinary(req.files,"portfolio_files")
    const suuccessfullUploades=uploadeFiles.filter(detail=>detail!==null)

    if(suuccessfullUploades.length===0){
      return res.status(500).json({
            message: "Failed to upload images to Cloudinary.",
            success: false,
            data: null
        });
    }
    const addPortfolioWork= await prisma.portfolioWork.create({
        data:{
            title,
            description,
            status: status === "true" || status === true,
            file:suuccessfullUploades
        }
    })
    return res.status(200).json({
        message:"PortfolioWork added successfully",
        success:true,
        data:addPortfolioWork
    })
}
const getAllPortfolioWorks=async(req,res)=>{
    const getallportfolioworks= await prisma.portfolioWork.findMany()
    return res.status(200).json({
        message:"Fetched all portfolioWorks",
        success:true,
        data:getallportfolioworks
    })
}

const getPortfolioWorkById= async(req,res)=>{
    const {portfolioWorkId}=req.params
    if(!portfolioWorkId){
        return res.status(401).json({
            message:"projectId is required",
            success:false,
            data:null
        })
    }
    const getportfoliowork= await prisma.portfolioWork.findUnique({
        where:{id:portfolioWorkId},
    })
    console.log(getportfoliowork)
    return res.status(200).json({
        message:"Fetched the portfolioWork by Id",
        success:true,
        data:getportfoliowork
    })
}
// const updatePortfolioWork = async (req, res) => {
//   const { portfolioWorkId } = req.params;

//   if (!portfolioWorkId) {
//     return res.status(400).json({
//       message: "portfolioWorkId is required",
//       success: false,
//       data: null,
//     });
//   }
//  
//     // Check if project exists
//     const existingportfoliowork = await prisma.portfoliowork.findUnique({
//       where: { id: portfolioWorkId },
//     });

//     if (!existingportfoliowork) {
//       return res.status(404).json({
//         message: "portfoliowork not found",
//         success: false,
//         data: null,
//       });
//     }

//     // Perform update
//     const updatedportfolioWork = await prisma.portfolioWork.update({
//       where: { id: portfolioWorkId },
//       data: req.body,
//     });

//     return res.status(200).json({
//       message: "portfolioWork updated successfully",
//       success: true,
//       data: updatedportfolioWork,
//     });
// };


const deleteportfoliowork=async(req,res)=>{
     const {portfolioWorkId}=req.params
    if(!portfolioWorkId){
        return res.status(401).json({
            message:"projectId is required",
            success:false,
            data:null
        })
    }
    const deleteportfoliowork= await prisma.portfolioWork.delete({
        where:{id:portfolioWorkId},
    })
    return res.status(200).json({
        message:"deleted the project by Id",
        success:true,
        data:deleteportfoliowork
    })
}


const viewportfolioworkfiles = async (req, res) => {
  const { id, fid } = req.params;
    const portfoliowork = await prisma.portfolioWork.findUnique({
      where: { id },
    });

    if (!portfoliowork) {
      return res.status(404).json({ message: "portfoliowork not found" });
    }

    const fileObject = portfoliowork.file.find((file) => file.id === fid); // ✅ images not files
    console.log(fileObject)

    if (!fileObject) {
      return res.status(404).json({ message: "File not found in portfoliowork" });
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


const updateportfolioworkWithFile = async (req, res) => {
  const { portfolioWorkId } = req.params;
  const { title, description, status } = req.body;

  if (!portfolioWorkId) {
    return res.status(400).json({ message: "portfolioworkId is required", success: false });
  }

    const existingportfoliowork = await prisma.portfolioWork.findUnique({ where: { id: portfolioWorkId } });

    if (!existingportfoliowork) {
      return res.status(404).json({ message: "portfoliowork not found", success: false });
    }

    let newImages = [];

    if (req.files && req.files.length > 0) {
      const deletePromises=existingportfoliowork.file.map(async(file)=>{

        if(file.public_id){
          try {
             await cloudinary.uploader.destroy(file.public_id)
          } catch (error) {
            console.error(`Failed to delete image from the cloudinary public_id:${file.public_id}`)
          }
        }
      if(file.path){
        const localFilePath= path.join(process.cwd(),file.path)
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

      const uploadPromises=req.files.map(async(file)=>{
        const filePath=file.path
        try {
          const result = await cloudinary.uploader.upload(filePath,{
            folder:'portfolio_files'
          })
          return {
            public_id: result.public_id,
            secureUrl: result.secure_url,
            fileName: file.filename,
            originalName: file.originalname,
            path: `/uploads/portfolioWorkFiles/${file.filename}`
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

    const updatedportfoliowork = await prisma.portfolioWork.update({
      where: { id: portfolioWorkId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(typeof status !== "undefined" && { status: status === "true" || status === true }),
        ...(newImages.length > 0 && { file: newImages }), // only update if new files uploaded
      },
    });

    return res.status(200).json({
      message: "portfoliowork updated successfully",
      success: true,
      data: updatedportfoliowork,
    });
 
};


export {
    addportfolioWork,
    getAllPortfolioWorks,
    getPortfolioWorkById,
    // updatePortfolioWork,
    deleteportfoliowork,
    viewportfolioworkfiles,
    updateportfolioworkWithFile
}