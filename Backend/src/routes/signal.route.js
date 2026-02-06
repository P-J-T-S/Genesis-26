import { Router } from "express";
import {
  getZones,
  injectComplaint,
  injectEvent,
  injectAlert
} from "../controllers/signal.controller.js";

const router = Router();

router.get("/zones", getZones);
router.post("/complaint", injectComplaint);
router.post("/event", injectEvent);
router.post("/alert", injectAlert);

export default router;