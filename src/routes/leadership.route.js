import { Router } from "express";
import {
  addLeadership,
  getAllLeadership,
  getLeadershipById,
  updateLeadership,
  deleteLeadership,
} from "../controllers/admin/leadership.js";
import { leadershipPics } from "../middlewares/multermiddleware.js";

const Leadership = Router();

Leadership.post("/add", leadershipPics.array("profilePic"), addLeadership);
Leadership.get("/all", getAllLeadership);
Leadership.get("/get/:id", getLeadershipById);
Leadership.put("/update/:id", leadershipPics.array("profilePic"), updateLeadership);
Leadership.delete("/delete/:id", deleteLeadership);

export { Leadership };
