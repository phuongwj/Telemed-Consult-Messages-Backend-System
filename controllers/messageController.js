import pool from "../databases/postgres.js";

/* Adding Message to a Consultation Endpoint */
export const addMessage = async (request, response) => {
    const { userId, consultationId, messageContent } = request.body;

    const insertMessageSql = `
        INSERT INTO message (user_id, consultation_id, message_content)
        VALUES ($1, $2, $3)
        RETURNING user_id, consultation_id, message_content, time_sent;
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

        response.status(201).send(JSON.stringify(responseObj));
    } catch (error) {
        console.error(`Error for adding messages occured: ${error}`);
    }
}  

/* Retrieving All Messages for A Specific Consultation Endpoint */
export const getConsultationMessages = async (request, response) => {
    const { consultationId, authorRole } = request.query;

    const getAllMessagesSql = `
        SELECT * 
        FROM message
        WHERE consultation_id = $1;
    `;

    const getAllMessagesByRoleSql = `
        SELECT *
        FROM message
        JOIN consult_user ON message.user_id = consult_user.user_id 
        WHERE message.consultation_id = $1 AND consult_user.user_role = $2;
    `;

    try {

        if (consultationId !== undefined && authorRole !== undefined) {
            const allMessagesByRoleResult = await pool.query(getAllMessagesByRoleSql, [consultationId, authorRole]);
            const allMessagesByRoleRows = allMessagesByRoleResult.rows;

            response.status(200).send(JSON.stringify(allMessagesByRoleRows));
        } else if (consultationId !== undefined) {
            const allMessagesResult = await pool.query(getAllMessagesSql, [consultationId]);
            const allMessagesRows = allMessagesResult.rows;
            
            response.status(200).send(JSON.stringify(allMessagesRows));
        }
        
    } catch (error) {
        console.error(`Error for getting messages occured: ${error}`);
    }
}