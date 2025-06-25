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
    updateProjectWithFile
} from '../controllers/project.js'

const router=Router()

router.post("/create",Authenticate,uploads.array("images"),asyncHandler(addproject))
router.get("/all",Authenticate,asyncHandler(getAllProjects))
router.get("/:projectId",Authenticate,asyncHandler(getProjectById))
// router.put("/update/:projectId",Authenticate,asyncHandler(updateProject))

router.put(
  "/update/:projectId",
  uploads.array("images"), 
  asyncHandler(updateProjectWithFile)//request in form-data
);


router.delete("/delete/:projectId",Authenticate,asyncHandler(deleteProject))
router.get("/viewFile/:id/:fid",asyncHandler(viewProjectfiles))


export{router as Project}