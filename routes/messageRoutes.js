import express from "express";
import { addConsultationMessage, getConsultationMessages } from "../controllers/messageController.js";

const router = express.Router();

router.post('/api/addConsultationMessage', addConsultationMessage);
router.get('/api/getConsultationMessages', getConsultationMessages);

export default router;