import express from "express";
import { addConsultationMessage, getConsultationMessages, deleteUserMessage } from "../controllers/messageController.js";

const router = express.Router();

/* Using routers to organize API endpoints */
router.post('/api/addConsultationMessage', addConsultationMessage);
router.get('/api/getConsultationMessages', getConsultationMessages);
router.delete('/api/deleteUserMessage', deleteUserMessage);

export default router;