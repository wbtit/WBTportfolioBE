import { Authenticate } from "../middlewares/authmiddleware.js";
import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {JDuploads} from '../middlewares/multermiddleware.js'
import {
    addJobRole,
    getAllJobRole,
    getJobRoleById,
    // updateJobRole,
    viewJobrolefiles,
    updateJobRoleWithFile,
    deleteJobRole
} from '../controllers/jobRole.js'

const router=Router()

router.post("/create",Authenticate,JDuploads.array("file"),asyncHandler(addJobRole))
router.get("/all",Authenticate,asyncHandler(getAllJobRole))
router.get("/:jobRoleId",Authenticate,asyncHandler(getJobRoleById))
// router.put("/update/:jobRoleId",Authenticate,asyncHandler(updatePortfolioWork))

router.put(
  "/update/:jobRoleId",
  JDuploads.array("file"), 
  asyncHandler(viewJobrolefiles)//request in form-data
);


router.delete("/delete/:jobRoleId",Authenticate,asyncHandler(updateJobRoleWithFile))
router.get("/viewFile/:id/:fid",asyncHandler(deleteJobRole))


export{router as PortfolioWork}