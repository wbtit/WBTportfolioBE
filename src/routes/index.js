import { Router } from "express";
import { User } from "./user.route.js";
import { Project } from "./project.route.js";
import  {PortfolioWork} from  "./portfoliowork.route.js"

const routes= Router()

routes.use("/user",User)
routes.use("/project",Project)
routes.use("/portfolioWork",PortfolioWork)

export {routes}