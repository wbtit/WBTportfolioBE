import { Authenticate } from "../middlewares/authmiddleware.js";
import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {PWuploads} from '../middlewares/multermiddleware.js'
import {
    addportfolioWork,
    getAllPortfolioWorks,
    getPortfolioWorkById,
    // updatePortfolioWork,
    deleteportfoliowork,
    viewportfolioworkfiles,
    updateportfolioworkWithFile
} from '../controllers/admin/portfolioWork.js'

const router=Router()

router.post("/create",Authenticate,PWuploads.array("file"),asyncHandler(addportfolioWork))
router.get("/all",asyncHandler(getAllPortfolioWorks))
router.get("/:portfolioWorkId",Authenticate,asyncHandler(getPortfolioWorkById))
// router.put("/update/:portfolioWorkId",Authenticate,asyncHandler(updatePortfolioWork))

router.put(
  "/update/:portfolioWorkId",
  PWuploads.array("file"), 
  asyncHandler(updateportfolioworkWithFile)//request in form-data
);


router.delete("/delete/:portfolioWorkId",Authenticate,asyncHandler(deleteportfoliowork))
router.get("/viewFile/:id/:fid",asyncHandler(viewportfolioworkfiles))


export{router as PortfolioWork}