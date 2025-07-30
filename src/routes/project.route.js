import { Authenticate } from "../middlewares/authmiddleware.js";
import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {uploads} from '../middlewares/multermiddleware.js'
import {
    addproject,
    getAllProjects,
    getProjectById,
    // updateProject,
    deleteProject,
    viewProjectfiles,
    updateProjectWithFile,
    getSampleImages
} from '../controllers/admin/project.js'

const router=Router()

router.post("/create",Authenticate,uploads.array("images"),asyncHandler(addproject))
router.get("/all",asyncHandler(getAllProjects))
router.get("/:projectId",asyncHandler(getProjectById))
// router.put("/update/:projectId",Authenticate,asyncHandler(updateProject))

router.patch(
  "/update/:projectId",
  uploads.array("images"), 
  asyncHandler(updateProjectWithFile)//request in form-data
);

router.get("/sampleFiles/:department",asyncHandler(getSampleImages))

router.delete("/delete/:projectId",Authenticate,asyncHandler(deleteProject))
router.get("/viewFile/:id/:fid",asyncHandler(viewProjectfiles))


export{router as Project} 