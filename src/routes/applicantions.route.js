import { Authenticate } from "../middlewares/authmiddleware.js";
import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Applications} from '../middlewares/multermiddleware.js'
import {
    addApplicant,
    getAllApplicationByJD,
    getapplicationsById,
    reject,
    viewapplicationfiles,
    updateApplicationWithFile,
    deleteApplication
} from '../controllers/admin/applicants.js'

const router=Router()

router.post("/create/:jbroleId",Applications.array("resume"),asyncHandler(addApplicant))
router.get("/all/:jbroleId",asyncHandler(getAllApplicationByJD))
router.get("/:jbroleId/:applcationId",asyncHandler(getapplicationsById))

//Reject
router.put("/update/:jbroleId",Authenticate,asyncHandler(reject))

router.put(
  "/update/:jbroleId/:applcationId",
  Applications.array("resume"), 
  asyncHandler(updateApplicationWithFile)//request in form-data
);


router.delete("/delete/:jbroleId/:applcationId",Authenticate,asyncHandler(deleteApplication))
router.get("/viewFile/:id/:fid",asyncHandler(viewapplicationfiles))


export{router as Application}