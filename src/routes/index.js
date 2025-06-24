import { Router } from "express";
import { User } from "./user.route.js";

const routes= Router()

routes.use("/user",User)

export {routes}