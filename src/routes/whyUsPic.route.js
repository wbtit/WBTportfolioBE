import { Authenticate } from "../middlewares/authmiddleware.js";
import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { whyUsPics } from "../middlewares/multermiddleware.js";

import {
  addWhyUsPic,
  getAllWhyUsPic,
  getWhyUsPicById,
  updateWhyUsPic,
  deleteWhyUsPic
} from "../controllers/admin/whyUsPic.js";

const router = Router();

router.post(
  "/create",
  Authenticate,
  whyUsPics.array("image", 50),
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

router.put(
  "/update/:id",
  Authenticate,
  whyUsPics.array("image", 50),
  asyncHandler(updateWhyUsPic)
);

router.delete(
  "/delete/:id",
  Authenticate,
  asyncHandler(deleteWhyUsPic)
);

export { router as WhyUsPic };