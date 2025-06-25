import prisma from "../db/prismaClient.js";
import path from "path";
import fs from 'fs'
import mime from 'mime'
const addproject=async(req,res)=>{
    const{title,description,location,type,technologyused,status}=req.body
    if(!title||!description||!location||!type||!technologyused||!status){
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
        path:`/uploads/projectFiles/${file.filename}`
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
            title,
            description,
            location,
            type,
            technologyused,
            status,
            images:fileDetailes
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
// const updateProject = async (req, res) => {
//   const { projectId } = req.params;

//   if (!projectId) {
//     return res.status(400).json({
//       message: "projectId is required",
//       success: false,
//       data: null,
//     });
//   }

//   try {
//     // Check if project exists
//     const existingProject = await prisma.project.findUnique({
//       where: { id: projectId },
//     });

//     if (!existingProject) {
//       return res.status(404).json({
//         message: "Project not found",
//         success: false,
//         data: null,
//       });
//     }

//     // Perform update
//     const updatedProject = await prisma.project.update({
//       where: { id: projectId },
//       data: req.body,
//     });

//     return res.status(200).json({
//       message: "Project updated successfully",
//       success: true,
//       data: updatedProject,
//     });
//   } catch (error) {
//     console.error("Update error:", error);
//     return res.status(500).json({
//       message: "Failed to update project",
//       success: false,
//       data: null,
//     });
//   }
// };


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
        message:"deleted the project by Id",
        success:true,
        data:deleteProject
    })
}


const viewProjectfiles = async (req, res) => {
  const { id, fid } = req.params;
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const fileObject = project.images.find((file) => file.id === fid); // ✅ images not files

    if (!fileObject) {
      return res.status(404).json({ message: "File not found in project" });
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


const updateProjectWithFile = async (req, res) => {
  const { projectId } = req.params;
  const { title, description, location, type, technologyused, status } = req.body;

  if (!projectId) {
    return res.status(400).json({ message: "projectId is required", success: false });
  }

  
    const existingProject = await prisma.project.findUnique({ where: { id: projectId } });

    if (!existingProject) {
      return res.status(404).json({ message: "Project not found", success: false });
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
        path: `/uploads/projectFiles/${file.filename}`,
      }));
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(location && { location }),
        ...(type && { type }),
        ...(technologyused && { technologyused }),
        ...(status && { status }),
        ...(newImages.length > 0 && { images: newImages }), // only update if new files uploaded
      },
    });

    return res.status(200).json({
      message: "Project updated successfully",
      success: true,
      data: updatedProject,
    });
};


export {
    addproject,
    getAllProjects,
    getProjectById,
    // updateProject,
    deleteProject,
    viewProjectfiles,
    updateProjectWithFile
}