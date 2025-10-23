import pool from "../databases/postgres.js";

/* Adding Message Endpoint */
export const addMessage = (request, response) => {
    const { consultationId, author, authorRole, messageContent, timestamp } = request.body;

    pool.query();
}

/* Retrieving Messages Endpoint */
export const retrieveMessage = (request, response) => {
    const { messages, authorRole } = request.body;

    pool.query();
}