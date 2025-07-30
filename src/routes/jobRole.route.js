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
} from '../controllers/admin/jobRole.js'

const router=Router()

router.post("/create",Authenticate,JDuploads.array("jd"),asyncHandler(addJobRole))
router.get("/all",Authenticate,asyncHandler(getAllJobRole))
router.get("/:jobRoleId",Authenticate,asyncHandler(getJobRoleById))
// router.put("/update/:jobRoleId",Authenticate,asyncHandler(updatePortfolioWork))

router.put(
  "/update/:jobRoleId",
  JDuploads.array("jd"), 
  asyncHandler(updateJobRoleWithFile)//request in form-data
);


router.delete("/delete/:jobRoleId",Authenticate,asyncHandler(deleteJobRole))
router.get("/viewFile/:id/:fid",asyncHandler(viewJobrolefiles))


export{router as JobRole}