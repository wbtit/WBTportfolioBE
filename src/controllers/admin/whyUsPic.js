import prisma from "../../db/prismaClient.js";
import { uploadFilesToCloudinary } from "../../utils/uploadFilesToCloudinary.js";


const addWhyUsPic = async (req, res) => {
  try {

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "Please upload at least one image",
        success: false,
        data: null,
      });
    }

    const { tag, title, description, order } = req.body;

    if (
      !tag ||
      !title ||
      !description ||
      order === undefined
    ) {
      return res.status(400).json({
        message: "Please fill all the fields",
        success: false,
        data: null,
      });
    }

    const orderNumber = parseInt(order, 10);

    if (isNaN(orderNumber)) {
      return res.status(400).json({
        message: "Order must be a number",
        success: false,
        data: null,
      });
    }

    const uploadedFiles = await uploadFilesToCloudinary(
      req.files,
      "whyUsPic"
    );

    const uploadedImages = uploadedFiles.map(
      (file) => file.secureUrl
    );

    if (uploadedImages.some((file) => !file)) {
      return res.status(400).json({
        message: "Failed to upload one or more images",
        success: false,
        data: null,
      });
    }

    const whyUsPic = await prisma.whyUsPic.create({
      data: {
        tag,
        title,
        description,
        order: orderNumber,
        image: uploadedImages,
      },
    });

    return res.status(200).json({
      message: "WhyUsPic added successfully",
      success: true,
      data: whyUsPic,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Error adding WhyUsPic",
      success: false,
      data: null,
    });
  }
};


const getAllWhyUsPic = async (req, res) => {
  try {

    const whyUsPic = await prisma.whyUsPic.findMany({
      orderBy: {
        order: "asc",
      },
    });

    return res.status(200).json({
      message: "Successfully fetched all WhyUsPic",
      success: true,
      data: whyUsPic,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Error fetching WhyUsPic",
      success: false,
      data: null,
    });
  }
};


const getWhyUsPicById = async (req, res) => {
  try {

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Please provide id",
        success: false,
        data: null,
      });
    }

    const idNumber = parseInt(id, 10);

    if (isNaN(idNumber)) {
      return res.status(400).json({
        message: "Invalid id",
        success: false,
        data: null,
      });
    }

    const whyUsPic = await prisma.whyUsPic.findUnique({
      where: {
        id: idNumber,
      },
    });

    if (!whyUsPic) {
      return res.status(404).json({
        message: "WhyUsPic not found",
        success: false,
        data: null,
      });
    }

    return res.status(200).json({
      message: "Successfully fetched WhyUsPic",
      success: true,
      data: whyUsPic,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Error fetching WhyUsPic",
      success: false,
      data: null,
    });
  }
};


const updateWhyUsPic = async (req, res) => {
  try {

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Please provide id",
        success: false,
        data: null,
      });
    }


    const existingWhyUsPic = await prisma.whyUsPic.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingWhyUsPic) {
      return res.status(404).json({
        message: "WhyUsPic not found",
        success: false,
        data: null,
      });
    }

    const { tag, title, description, order } = req.body;

    const updateData = {};

    if (tag !== undefined) {
      updateData.tag = tag;
    }

    if (title !== undefined) {
      updateData.title = title;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    let existingImages = [];
    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        existingImages = [...req.body.image];
      } else {
        existingImages = [req.body.image];
      }
    }

    if (req.files && req.files.length > 0) {
      const uploadedFiles = await uploadFilesToCloudinary(
        req.files,
        "whyUsPic"
      );

      const uploadedImages = uploadedFiles.map(
        (file) => file.secureUrl
      );

      if (uploadedImages.some((file) => !file)) {
        return res.status(400).json({
          message: "Failed to upload one or more images",
          success: false,
          data: null,
        });
      }

      updateData.image = [...existingImages, ...uploadedImages];
    } else if (existingImages.length > 0) {
      updateData.image = existingImages;
    } else {
      return res.status(400).json({
        message: "Please provide at least one image",
        success: false,
        data: null,
      });
    }

    const updatedWhyUsPic = await prisma.whyUsPic.update({
      where: {
        id: id,
      },
      data: updateData,
    });

    return res.status(200).json({
      message: "WhyUsPic updated successfully",
      success: true,
      data: updatedWhyUsPic,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Error updating WhyUsPic",
      success: false,
      data: null,
    });
  }
};


const deleteWhyUsPic = async (req, res) => {
  try {

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Please provide id",
        success: false,
        data: null,
      });
    }

    const idNumber = parseInt(id, 10);

    if (isNaN(idNumber)) {
      return res.status(400).json({
        message: "Invalid id",
        success: false,
        data: null,
      });
    }

    const deleteWhyUsPic = await prisma.whyUsPic.delete({
      where: {
        id: idNumber,
      },
    });

    return res.status(200).json({
      message: "Successfully deleted WhyUsPic",
      success: true,
      data: deleteWhyUsPic,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Error deleting WhyUsPic",
      success: false,
      data: null,
    });
  }
};


export {
  addWhyUsPic,
  getAllWhyUsPic,
  getWhyUsPicById,
  updateWhyUsPic,
  deleteWhyUsPic,
};