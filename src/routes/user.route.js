import { Authenticate } from "../middlewares/authmiddleware.js";
import { Router } from "express";
import {signup,login,resetPassword} from "../controllers/users.js"


const router= Router()

router.post("/signup",signup)
router.post("/login",login)
router.post("/resetPassword",Authenticate,resetPassword)

export {router as User}