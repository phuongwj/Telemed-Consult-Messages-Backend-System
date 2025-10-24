import express from "express";
import { addMessage, retrieveMessage } from "../controllers/messageController.js";

const router = express.Router();

router.post('/addMessage', addMessage);

/**
 * router.get('/.../', call retrieveMessage function)
 */

export default router;