import { Authenticate } from "../middlewares/authmiddleware";
import { Router } from "express";
import {signup,login,resetPassword} from "../controllers/users.js"


const router= Router()

router.post("/signup",Authenticate,signup)
router.post("/login",Authenticate,login)
router.post("/resetPassword",Authenticate,resetPassword)

export {router as User}