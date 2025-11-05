import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/dashboard", protect, authorizeRoles("patient"), (req, res) => {
  res.json({ msg: `Welcome patient ${req.user.name}` });
});

export default router;
