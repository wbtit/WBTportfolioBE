import prisma from "../../db/prismaClient.js";
import path from "path";
import fs from 'fs'
import mime from 'mime'
import { cloudinary } from "../../config/cloudinaryConfig.js";
import { uploadFilesToCloudinary } from "../../utils/uploadFilesToCloudinary.js";
import { sendEmail } from "../../services/index.js";


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
const reject = async (req, res) => {
  const {applcationId}=req.params


  if (!applcationId) {
    return res.status(400).json({
      message: "ApplcationId is required",
      success: false,
      data: null,
    });
  }
 
    // Check if project exists
    const existingapplication = await prisma.applications.findUnique({
      where: { id: applcationId},
      include:{
        jobrole:true
      }
    });

    if (!existingapplication) {
      return res.status(404).json({
        message: "Application not found",
        success: false,
        data: null,
      });
    }

    // Perform update
    const updatedapplication = await prisma.applications.update({
      where: { id: applcationId,
 },   data:{
        rejected:true
      },
    });

    const htmlContent = `<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Job Application Update - Whiteboard Technologies</title>
<style>
  body {
    font-family: Arial, Helvetica, sans-serif;
    background-color: #f4f6f8;
    color: #333333;
    margin: 0;
    padding: 0;
  }

  .email-wrapper {
    max-width: 650px;
    margin: 40px auto;
    background-color: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e0e0e0;
  }

  .email-header {
    background-color: #6adb45;
    padding: 20px;
    text-align: center;
  }

  .email-header img {
    max-width: 120px;
    margin-bottom: 10px;
  }

  .email-header h1 {
    margin: 0;
    color: #ffffff;
    font-size: 22px;
    font-weight: bold;
  }

  .email-body {
    padding: 25px 30px;
    line-height: 1.6;
  }

  .email-body h2 {
    font-size: 18px;
    color: #333333;
    margin-bottom: 10px;
  }

  .info-table {
    border-collapse: collapse;
    width: 100%;
    margin-top: 15px;
  }

  .info-table th,
  .info-table td {
    text-align: left;
    padding: 10px;
    border: 1px solid #dddddd;
    font-size: 14px;
  }

  .info-table th {
    background-color: #f4f4f4;
    color: #555555;
    width: 30%;
  }

  .footer {
    text-align: center;
    padding: 20px;
    font-size: 12px;
    color: #777777;
    background-color: #f9f9f9;
  }

  .footer img {
    max-width: 120px;
    margin-top: 10px;
  }
</style>
</head>

<body>
  <div class="email-wrapper">
    <!-- Header -->
    <div class="email-header">
      <img src="https://firebasestorage.googleapis.com/v0/b/whiteboard-website.appspot.com/o/assets%2Fimage%2Flogo%2Fwhiteboardtec-logo.png?alt=media&token=f73c5257-9b47-4139-84d9-08a1b058d7e9" alt="Whiteboard Technologies Logo" />
      <h1>Job Application Update</h1>
    </div>

    <!-- Body -->
    <div class="email-body">
      <h2>Dear ${existingapplication.name},</h2>
      <p>Thank you for taking the time to apply for the <strong>${existingapplication.jobrole.Role}</strong> role at Whiteboard Technologies. We truly appreciate your interest in our company and the effort you put into your application.</p>

      <p>After careful consideration, we regret to inform you that we will not be moving forward with your application at this time. Please know that this decision was not easy, as we had many qualified candidates.</p>

      <p>We encourage you to apply for future opportunities with us that match your skills and experience. We wish you all the best in your job search and future professional endeavors.</p>

      <p style="margin-top: 20px; font-size: 13px; color: #777;">
        This email was automatically generated to provide an update regarding your application.
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>Whiteboard Technologies Pvt. Ltd.</strong></p>
      <p>Bangalore, India</p>
      <img src="https://firebasestorage.googleapis.com/v0/b/whiteboard-website.appspot.com/o/assets%2Fimage%2Flogo%2Fwhiteboardtec-logo.png?alt=media&token=f73c5257-9b47-4139-84d9-08a1b058d7e9" alt="Whiteboard Technologies Logo" />
    </div>
  </div>
</body>

</html>
`;

    if(updatedapplication){
      sendEmail({
        html:htmlContent,
        to:existingapplication.email,
        Subject:"Job Application Update",
        text:"Job Application Update"
      })
    }

    return res.status(200).json({
      message: "application Rejected successfully",
      success: true,
      data: updatedapplication,
    });
};


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
    newImages = await updateCloudinaryFiles(existingportfoliowork.resume, req.files, "Applicants");

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
        ...(typeof status !== "undefined" && { status: status === "true" || status === true }), // support both string/boolean
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
    reject,
    viewapplicationfiles,
    updateApplicationWithFile,
    deleteApplication
}