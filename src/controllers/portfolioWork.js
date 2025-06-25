import prisma from "../db/prismaClient.js";
import path from "path";
import fs from 'fs'
import mime from 'mime'


const addportfolioWork=async(req,res)=>{
    const{title,description,status}=req.body
    if(!title||!description||!status){
        return res.status(401).json({
            message:"Feilds are empty",
            success:false,
            data:null
        })
    }
    const fileDetailes= req.files.map((file)=>({
        filename:file.filename,
        originalName:file.originalName,
        id:file.filename.split(".")[0],
        path:`/uploads/portfolioWorkFiles/${file.filename}`
    }))
    if(!fileDetailes){
        return res.status(400).json({
            message:"failed to fetch the file detailes",
            success:false,
            data:null
        })
    }
    const addPortfolioWork= await prisma.portfoliowork.create({
        data:{
            title,
            description,
            status,
            file:fileDetailes
        }
    })
    return res.status(200).json({
        message:"PortfolioWork added successfully",
        success:true,
        data:addPortfolioWork
    })
}
const getAllPortfolioWorks=async(req,res)=>{
    const getallportfolioworks= await prisma.portfoliowork.findMany()
    return res.status(200).json({
        message:"Fetched all portfolioWorks",
        success:true,
        data:getallportfolioworks
    })
}

const getPortfolioWorkById= async(req,res)=>{
    const {portfolioWorkId}=req.params
    if(!projectId){
        return res.status(401).json({
            message:"projectId is required",
            success:false,
            data:null
        })
    }
    const getportfoliowork= await prisma.portfoliowork.findUnique({
        where:{id:portfolioWorkId},
    })
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
//     const updatedportfolioWork = await prisma.portfoliowork.update({
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
    const deleteportfoliowork= await prisma.portfoliowork.delete({
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
    const portfoliowork = await prisma.portfoliowork.findUnique({
      where: { id },
    });

    if (!portfoliowork) {
      return res.status(404).json({ message: "portfoliowork not found" });
    }

    const fileObject = portfoliowork.file.find((file) => file.id === fid); // ✅ images not files

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

    const existingportfoliowork = await prisma.portfoliowork.findUnique({ where: { id: projectId } });

    if (!existingportfoliowork) {
      return res.status(404).json({ message: "portfoliowork not found", success: false });
    }

    let newImages = [];

    if (req.files && req.files.length > 0) {
      // Optional: remove old files from disk (careful!)
      for (const file of existingProject.images) {
        const filePath = path.join(process.cwd(), file.path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // ⚠️ Deletes the file
        }
      }

      newImages = req.files.map((file) => ({
        filename: file.filename,
        originalName: file.originalname,
        id: file.filename.split(".")[0],
        path: `/uploads/portfolioWorkFiles/${file.filename}`,
      }));
    }

    const updatedportfoliowork = await prisma.portfoliowork.update({
      where: { id: portfolioWorkId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
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