import pool from "../databases/postgres.js";

/* Adding Message to a Consultation Endpoint */
export const addMessage = async (request, response) => {
    const { userId, consultationId, messageContent } = request.body;

    const insertMessageSql = `
        INSERT INTO message (user_id, consultation_id, message_content)
        VALUES ($1, $2, $3)
        RETURNING user_id, consultation_id, message_content, time_sent
    `;

    const userSql = `
        SELECT consult_user.user_full_name, consult_user.user_role 
        FROM consult_user
        WHERE consult_user.user_id = $1;
    `;

    try {
        const insertMessageResult = await pool.query(insertMessageSql, [userId, consultationId, messageContent]);
        const insertedMessageRow = insertMessageResult.rows[0];

        const userResult = await pool.query(userSql, [insertedMessageRow.user_id]);
        const userRow = userResult.rows[0];

        const responseObj = {
            consultation_id: insertedMessageRow.consultation_id,
            author: userRow.user_full_name,
            author_role: userRow.user_role,
            message_content: insertedMessageRow.message_content,
            timestamp: insertedMessageRow.time_sent
        }

        response.status(201).send(responseObj);
    } catch (error) {
        console.error(`Error occured: ${error}`);
    }
}  

/* Retrieving All Messages for A Specific Consultation Endpoint */
export const getAllMessages = async (request, response) => {
    const { consultationId, authorRole } = request.body;

    pool.query();
}