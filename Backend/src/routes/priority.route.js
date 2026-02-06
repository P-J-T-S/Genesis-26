import { Router } from "express";
import { getPriorityZones } from "../controllers/priority.controller.js";

const router = Router();

router.get("/", getPriorityZones);

export default router;