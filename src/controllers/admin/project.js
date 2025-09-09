import prisma from "../../db/prismaClient.js";
import path from "path";
import fs from 'fs'
import mime from 'mime'
import { uploadFilesToCloudinary } from "../../utils/uploadFilesToCloudinary.js";
import { updateCloudinaryFiles } from "../../utils/updateCloudinaryFiles.js";


const addproject=async(req,res)=>{
    const{title,description,location,type,technologyused,status,department,designingSoftware,otherType}=req.body
    if(!title||!description||!location||!type||!technologyused||!status||!department){
        return res.status(400).json({
            message:"Feilds are empty",
            success:false,
            data:null
        })
    }

    if(!req.files || req.files.length === 0){
        return res.status(400).json({
          message:"Images are not uploaded",
          success:false,
          data:null
        })
    }
    
  
    const uploadedImages= await uploadFilesToCloudinary(req.files,"projectFiles")
    const successfullUploads= uploadedImages.filter(detail=>detail!== null)

    if(successfullUploads.length === 0) {
        // If all uploads failed, return an error.
        return res.status(500).json({
            message: "Failed to upload images to Cloudinary.",
            success: false,
            data: null
        });
    }
    const addProject= await prisma.project.create({
        data:{
            title,
            description,
            location,
            department,
            type,
            otherType,
            technologyused,
            designingSoftware,
             status,
            images:successfullUploads
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
        return res.status(400).json({
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
        return res.status(400).json({
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
  const { title, description, location, type, technologyused, status,department,designingSoftware,otherType} = req.body;

  if (!projectId) {
    return res.status(400).json({ message: "projectId is required", success: false });
  }

  
    const existingProject = await prisma.project.findUnique({ where: { id: projectId } });

    if (!existingProject) {
      return res.status(404).json({ message: "Project not found", success: false });
    }

    let newImages = [];

     if (req.files && req.files.length > 0) {
    newImages = await updateCloudinaryFiles(existingProject.images, req.files, "projectFiles", "uploads/projectFiles");

    if (newImages.length === 0) {
      console.warn("No images were uploaded successfully.");
    }
  }
     

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(location && { location }),
        ...(department && {department}),
        ...(type && { type }),
        ...(technologyused && { technologyused }),
        ...(designingSoftware && {designingSoftware}),
        ...(status && {status}),
        ...(otherType && {otherType}),
        ...(newImages.length > 0 && { images: newImages }), // only update if new files uploaded
      },
    });

    return res.status(200).json({
      message: "Project updated successfully",
      success: true,
      data: updatedProject,
    });
};
const getSampleImages=async(req,res)=>{
  const{department}=req.params
   const projects = await prisma.project.findMany({
      where: { department },
    });

  const sampleFiles= projects.map(project=>{
    if(project.images && project.images.length>0){
      const file=project.images[0]
      const filePath = path.join(process.cwd(), file.path);
       
      if (fs.existsSync(filePath)) {
            return {
              projectId: project.id,
              technologyused:project.technologyused,
              designingSoftware:project.designingSoftware,
              otherType:project.otherType,
              projectTitle: project.title,
              file: {
                id: file.id,
                filename: file.filename,
                path: file.path,
                url: file.path,
                secureUrl:file.secureUrl
              },
            };
          }
        }
        return null;
      })
      .filter(Boolean); // remove nulls (projects with no files)
    //console.log("=-=-=-=-=-=-=-=-=-",sampleFiles)
    return res.status(200).json({
      message: "Sample files from each project",
      success: true,
      data: sampleFiles,
    });
    }


export {
    addproject,
    getAllProjects,
    getProjectById,
    // updateProject,
    deleteProject,
    viewProjectfiles,
    updateProjectWithFile,
    getSampleImages
}