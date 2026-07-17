import { Router } from "express";
import { User } from "./user.route.js";
import { Project } from "./project.route.js";
import  {PortfolioWork} from  "./portfoliowork.route.js"
import { JobRole } from "./jobRole.route.js";
import { Application } from "./applicantions.route.js";
import {blog} from "./blog.route.js"
import { Leadership } from "./leadership.route.js";

const routes= Router()

routes.use("/user",User)
routes.use("/project",Project)
routes.use("/portfolioWork",PortfolioWork)
routes.use("/jobrole",JobRole)
routes.use("/applications",Application)
routes.use("/blog",blog)
routes.use("/leadership", Leadership)

export {routes}