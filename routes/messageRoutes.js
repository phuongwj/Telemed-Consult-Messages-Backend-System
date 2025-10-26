import express from "express";
import { addMessage, getConsultationMessages } from "../controllers/messageController.js";

const router = express.Router();

router.post('/api/addMessage', addMessage);
router.get('/api/getConsultationMessages', getConsultationMessages);

export default router;