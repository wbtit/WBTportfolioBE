import { Authenticate } from "../middlewares/authmiddleware.js";
import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
    addproject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
} from '../controllers/project.js'

const router=Router()

router.post("/create",Authenticate,asyncHandler(addproject))
router.get("/all",Authenticate,asyncHandler(getAllProjects))
router.get("/:projectId",Authenticate,asyncHandler(getProjectById))
router.put("/update/:projectId",Authenticate,asyncHandler(updateProject))
router.delete("/delete/:projectId",Authenticate,asyncHandler(deleteProject))

export{router as Project}