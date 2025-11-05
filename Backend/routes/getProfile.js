import express from "express";
import { getUserProfile } from "../controllers/userController.js";
import {authMiddleware} from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/getUserProfile",authMiddleware,getUserProfile);
 
export default router;
      