import express from "express";
import { generateDiet } from "../controllers/dietController.js";

const router = express.Router();

router.post("/generate", generateDiet);

export default router;