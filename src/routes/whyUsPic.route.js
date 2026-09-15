import { Authenticate } from "../middlewares/authmiddleware.js";
import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { whyUsPics } from "../middlewares/multermiddleware.js";

import {
  addWhyUsPic,
  getAllWhyUsPic,
  deleteWhyUsPic,
  getWhyUsPicById
} from "../controllers/admin/whyUsPic.js";

const router = Router();

router.post(
  "/create",
  Authenticate,
  whyUsPics.array("image",10),
  asyncHandler(addWhyUsPic)
);

router.get(
  "/all",
  asyncHandler(getAllWhyUsPic)
);

router.get(
  "/:id",
  asyncHandler(getWhyUsPicById)
);

router.delete(
  "/delete/:id",
  Authenticate,
  asyncHandler(deleteWhyUsPic)
);

export { router as WhyUsPic };