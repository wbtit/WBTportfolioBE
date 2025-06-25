import { Authenticate } from "../middlewares/authmiddleware.js";
import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {JDuploads} from '../middlewares/multermiddleware.js'
import {
    addApplicant,
    getAllApplicationByJD,
    getapplicationsById,
    // updateapplication,
    viewapplicationfiles,
    updateApplicationWithFile,
    deleteApplication
} from '../controllers/applicants.js'

const router=Router()

router.post("/create/:jbroleId",Authenticate,JDuploads.array("resume"),asyncHandler(addApplicant))
router.get("/all/:jbroleId",Authenticate,asyncHandler(getAllApplicationByJD))
router.get("/:jbroleId/:applcationId",Authenticate,asyncHandler(getapplicationsById))
// router.put("/update/:jbroleId/:applcationId",Authenticate,asyncHandler(updateapplication))

router.put(
  "/update/:jbroleId/:applcationId",
  JDuploads.array("resume"), 
  asyncHandler(updateApplicationWithFile)//request in form-data
);


router.delete("/delete/:jbroleId/:applcationId",Authenticate,asyncHandler(deleteApplication))
router.get("/viewFile/:id/:fid",asyncHandler(viewapplicationfiles))


export{router as Application}