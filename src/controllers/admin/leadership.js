import prisma from "../../db/prismaClient.js";
import { uploadFilesToCloudinary } from "../../utils/uploadFilesToCloudinary.js";
import { updateCloudinaryFiles } from "../../utils/updateCloudinaryFiles.js";

const addLeadership = async (req, res) => {
  try {
    const { name, designation, bio, socialLinks } = req.body;

    if (!name || !designation || !bio) {
      return res.status(400).json({
        message: "Name, designation, and bio are required",
        success: false,
        data: null,
      });
    }

    let parsedSocialLinks = [];
    if (socialLinks) {
      try {
        parsedSocialLinks = JSON.parse(socialLinks);
      } catch (error) {
        parsedSocialLinks = socialLinks; // Assume array or string if parse fails
      }
    }

    let successfulUploads = [];
    if (req.files && req.files.length > 0) {
      const uploadedFiles = await uploadFilesToCloudinary(req.files, "leadershipPics");
      successfulUploads = uploadedFiles.filter(detail => detail !== null);

      if (successfulUploads.length === 0) {
        return res.status(500).json({
          message: "Failed to upload profile pic to Cloudinary.",
          success: false,
          data: null,
        });
      }
    }

    const newLeadership = await prisma.leadership.create({
      data: {
        name,
        designation,
        bio,
        socialLinks: parsedSocialLinks,
        profilePic: successfulUploads,
      },
    });

    return res.status(201).json({
      message: "Leadership added successfully",
      success: true,
      data: newLeadership,
    });
  } catch (error) {
    console.error("Error adding leadership:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      data: null,
    });
  }
};

const getAllLeadership = async (req, res) => {
  try {
    const leaderships = await prisma.leadership.findMany();
    return res.status(200).json({
      message: "Fetched all leadership records",
      success: true,
      data: leaderships,
    });
  } catch (error) {
    console.error("Error fetching leaderships:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      data: null,
    });
  }
};

const getLeadershipById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Leadership ID is required",
        success: false,
        data: null,
      });
    }

    const leadership = await prisma.leadership.findUnique({
      where: { id },
    });

    if (!leadership) {
      return res.status(404).json({
        message: "Leadership record not found",
        success: false,
        data: null,
      });
    }

    return res.status(200).json({
      message: "Fetched leadership record by ID",
      success: true,
      data: leadership,
    });
  } catch (error) {
    console.error("Error fetching leadership by ID:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      data: null,
    });
  }
};

const updateLeadership = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, bio, socialLinks } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Leadership ID is required",
        success: false,
      });
    }

    const existingLeadership = await prisma.leadership.findUnique({
      where: { id },
    });

    if (!existingLeadership) {
      return res.status(404).json({
        message: "Leadership record not found",
        success: false,
      });
    }

    let parsedSocialLinks = existingLeadership.socialLinks;
    if (socialLinks) {
      try {
        parsedSocialLinks = JSON.parse(socialLinks);
      } catch (error) {
        parsedSocialLinks = socialLinks;
      }
    }

    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = await updateCloudinaryFiles(existingLeadership.profilePic, req.files, "leadershipPics");
      if (newImages.length === 0) {
        console.warn("No images were uploaded successfully.");
      }
    }

    const updatedLeadership = await prisma.leadership.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(designation && { designation }),
        ...(bio && { bio }),
        ...(socialLinks && { socialLinks: parsedSocialLinks }),
        ...(newImages.length > 0 && { profilePic: newImages }),
      },
    });

    return res.status(200).json({
      message: "Leadership updated successfully",
      success: true,
      data: updatedLeadership,
    });
  } catch (error) {
    console.error("Error updating leadership:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      data: null,
    });
  }
};

const deleteLeadership = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Leadership ID is required",
        success: false,
        data: null,
      });
    }

    const deletedLeadership = await prisma.leadership.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Leadership deleted successfully",
      success: true,
      data: deletedLeadership,
    });
  } catch (error) {
    console.error("Error deleting leadership:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      data: null,
    });
  }
};

export {
  addLeadership,
  getAllLeadership,
  getLeadershipById,
  updateLeadership,
  deleteLeadership,
};
