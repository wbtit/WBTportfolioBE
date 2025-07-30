import { Authenticate } from "../middlewares/authmiddleware.js";
import { Router } from "express";
import {signup,login,resetPassword} from "../controllers/admin/users.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { getAllCustomerData,addCustomerData } from "../controllers/admin/customerData.js";

const router= Router()

router.post("/signup",asyncHandler(signup))
router.post("/login",asyncHandler(login))
router.post("/resetPassword",Authenticate,asyncHandler(resetPassword))
router.post("/response",asyncHandler(addCustomerData))
router.get("/userData",asyncHandler(getAllCustomerData))

export {router as User}