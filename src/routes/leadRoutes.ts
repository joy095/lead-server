import { Router } from "express";
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  getAnalytics,
} from "../controllers/leadController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.use(protect); // Protect all routes

router.route("/").get(getLeads).post(createLead);

router.get("/analytics", getAnalytics);
router.route("/:id").get(getLeadById).put(updateLead).delete(deleteLead);

export default router;
