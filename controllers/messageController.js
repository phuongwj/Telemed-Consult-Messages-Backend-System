import pool from "../databases/postgres.js";

/* Adding Message to a Consultation Endpoint */
export const addConsultationMessage = async (request, response) => {
    const { userId, consultationId, messageContent } = request.body; // Destructuring

    response.set('Content-Type', 'application/json');

    if (userId === undefined || consultationId === undefined || messageContent === undefined) {
        return response.status(400).send("Missing required field(s) for adding a message.");
    }

    const getConsultationId = `
        SELECT consultation_id
        FROM consultation
        WHERE consultation_id = $1;
    `;

    const userSql = `
        SELECT consult_user.user_full_name, consult_user.user_role 
        FROM consult_user
        WHERE consult_user.user_id = $1;
    `;

    const insertMessageSql = `
        INSERT INTO message (user_id, consultation_id, message_content)
        VALUES ($1, $2, $3)
        RETURNING user_id, consultation_id, message_content, time_sent;
    `;

    try {
        const userResult = await pool.query(userSql, [userId]);
        if (userResult.rows.length == 0) {
            return response.status(404).send("Error adding a message, user not found");
        }
        const userRow = userResult.rows[0];

        const consultationResult = await pool.query(getConsultationId, [consultationId]);
        if (consultationResult.rows.length === 0) {
            return response.status(404).send("Error adding a message, Consultation ID not found");
        }

        const insertMessageResult = await pool.query(insertMessageSql, [userId, consultationId, messageContent]);
        const insertedMessageRow = insertMessageResult.rows[0];

        const responseObj = {
            consultation_id: insertedMessageRow.consultation_id,
            author: userRow.user_full_name,
            author_role: userRow.user_role,
            message_content: insertedMessageRow.message_content,
            timestamp: insertedMessageRow.time_sent
        }

        return response.status(201).send(JSON.stringify(responseObj));
    } catch (error) {
        console.error(`Error adding a message: ${error}`);

        return response.status(500).send("Internal Server Error");
    }
}  

/* Retrieving All Messages for A Specific Consultation Endpoint */
export const getConsultationMessages = async (request, response) => {
    let { consultationId, authorRole } = request.query; // Destructuring

    response.set('Content-Type', 'application/json');

    const getConsultationId = `
        SELECT consultation_id
        FROM consultation
        WHERE consultation_id = $1;
    `;

    const getAllMessagesSql = `
        SELECT * 
        FROM message
        JOIN consult_user ON message.user_id = consult_user.user_id
        WHERE consultation_id = $1;
    `;

    const getAllMessagesByRoleSql = `
        SELECT *
        FROM message
        JOIN consult_user ON message.user_id = consult_user.user_id 
        WHERE message.consultation_id = $1 AND consult_user.user_role = $2;
    `;    

    try {

        /* Parsing the Query Parameter consultationId String to a number, with a radix 10 to increase strictness */
        consultationId = parseInt(consultationId, 10);
        if (isNaN(consultationId)) {
            return response.status(400).send("Missing required field for getting all messages.");
        } 
        
        const consultationResult = await pool.query(getConsultationId, [consultationId]);
        const consultationRows = consultationResult.rows;
        const consultationRowsLength = consultationRows.length;
        if (consultationRowsLength === 0) {

            return response.status(404).send("Error for getting all messages, Consultation ID not found.");

        } else if ( (consultationRowsLength !== 0) && (authorRole !== undefined) && (authorRole === 'Doctor' || authorRole === 'Patient') ) {

            const allMessagesByRoleResult = await pool.query(getAllMessagesByRoleSql, [consultationId, authorRole]);
            const allMessagesByRoleRows = allMessagesByRoleResult.rows;

            return response.status(200).send(JSON.stringify(allMessagesByRoleRows));

        } else if (consultationRowsLength !== 0 && (authorRole === undefined)) {
            const allMessagesById = await pool.query(getAllMessagesSql, [consultationId]);
            const allMessagesByIdRows = allMessagesById.rows;
            
            return response.status(200).send(JSON.stringify(allMessagesByIdRows));
        } else {
            return response.status(404).send("Error for getting all messages by role. Role doesn't exist.");
        }
        
    } catch (error) {
        console.error(`Error getting all messages: ${error}`);

        return response.status(500).send("Internal Server Error");
    }
}