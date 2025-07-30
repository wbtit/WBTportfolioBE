import { Authenticate } from "../middlewares/authmiddleware.js";
import { Router } from "express";
import {signup,login,resetPassword} from "../controllers/admin/users.js"
import { asyncHandler } from "../utils/asyncHandler.js";


const router= Router()

router.post("/signup",asyncHandler(signup))
router.post("/login",asyncHandler(login))
router.post("/resetPassword",Authenticate,asyncHandler(resetPassword))

export {router as User}