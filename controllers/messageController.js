import pool from "../databases/postgres.js";

/* Adding Message Endpoint */
export const addMessage = async (request, response) => {
    const { userId, consultationId, messageContent } = request.body;

    try {
        await pool.query('INSERT INTO message (user_id, consultation_id, message_content) VALUES ($1, $2, $3)', [userId, consultationId, messageContent])
        response.status(201).send("if we reach here, that means it works");
    } catch (error) {
        console.error(`Error occured: ${error}`);
    }
}

/* Retrieving Messages Endpoint */
export const retrieveMessage = async (request, response) => {
    const { messages, authorRole } = request.body;

    pool.query();
}