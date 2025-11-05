import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/dashboard", protect, authorizeRoles("doctor"), (req, res) => {
  res.json({ msg: `Welcome doctor ${req.user.name}` });
});

export default router;
      