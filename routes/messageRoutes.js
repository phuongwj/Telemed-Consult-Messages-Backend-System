import express from "express";
import { addMessage, getConsultationMessages } from "../controllers/messageController.js";

const router = express.Router();

router.post('/addMessage', addMessage);
router.get('/getConsultationMessages', getConsultationMessages);

export default router;