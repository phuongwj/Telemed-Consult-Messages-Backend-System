import express from "express";
import { addConsultationMessage, getConsultationMessages } from "../controllers/messageController.js";

const router = express.Router();

/* Using routers to organize API endpoints */
router.post('/api/addConsultationMessage', addConsultationMessage);
router.get('/api/getConsultationMessages', getConsultationMessages);

export default router;