# Backend Message Storage System for Telemedicine Consultations

A Backend System to store and retrieve messages from telemedicine consultations between patients and doctors.

Table of Contents:
- [Setup Instructions](#setup-instructions)
- [Sample Data](#sample-data)
- [API Endpoints Documentation](#api-endpoints-documentation)
    + [Add a Message to a Consultation](#add-a-message-to-a-consultation)
    + [Get All Messages for a Consultation](#get-all-messages-for-a-consultation)

- [Architecture Decisions](#architecture-decisions)
    + [Data Model](#data-model)
    + [Technology Choices](#technology-choices)
    + [Production Readiness Plan](#production-readiness-plan)


- [Reflection](#reflection)


## Setup Instructions

### 1. Clone the repository

Download a copy of the project to your computer
```bash
git clone https://github.com/phuongwj/Telemed-Consult-Messages-Backend-System.git
cd Telemed-Consult-Messages-Backend-System
```

### 2. Install Docker if you don't have it yet

**Installation Guide:** https://docs.docker.com/get-started/get-docker/

Once Docker is installed, make sure you have the Docker Desktop app opened, then choose one of the following options to run the project locally:
- [Option 1: Using Terminal or Command Line](#option-1-build-and-run-with-docker-compose-using-terminal-or-command-line)
- [Option 2: Using `docker-compose.yaml`](#option-2-using-docker-composeyaml)

    ### Option 1: Build and Run with Docker Compose using Terminal or Command Line

    Make sure that you're in the root directory of the project to run the commands below.

    #### Step 1: Verify Docker Installation
    
    This will display the installed Docker version. If you see a version number, Docker is installed correctly.

    ```bash
    docker -v
    ```

    #### Step 2: Build the Docker Images

    Reads the `docker-compose.yaml` file to download project dependencies and prepares the database with initial seed data.

    ```
    docker compose build
    ```

    #### Step 3: Start the Services

    Launch both services (express server and postgresql database) from the `docker-compose.yaml` file

    ```
    docker compose up
    ```

    After running the command above, your terminal should look like this, which indicates a success in having the instance
    of the PostgreSQL database be seeded, as well as up and running. 

    ```bash
    preseeded-postgres-db  | date and time here [1] LOG:  database system is ready to accept connections
    ```

    #### Step 4: Verify Containers are Running

    Open a separate terminal to check that both containers (preseeded-postgres-db and express app) started successfully.

    ```
    docker ps
    ```

    And you should see something similar to the following:

    | CONTAINER ID | IMAGE | COMMAND | CREATED | STATUS| PORTS| NAMES |
    |---------------|----------------------------------------------------|---------------------------|------------------|--------------|-----------------------------------------------|------------------------|
    | 6c341f37e6c2  | telemed-consult-messages-backend-system-backend    | "docker-entrypoint.s…"    | 17 seconds ago   | Up 5 seconds | 0.0.0.0:8000->8000/tcp, [::]:8000->8000/tcp   | express-app            |
    | 2220187be40e  | telemed-consult-messages-backend-system-database   | "docker-entrypoint.s…"    | 18 seconds ago   | Up 6 seconds | 0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp   | preseeded-postgres-db  |


    #### Step 5: Once finished

    If you want to stop running the containers

    ```
    docker compose down
    ```

    ### Option 2: Using `docker-compose.yaml`

    **Note:** This option will provide the same result as Option 1, but much simpler.

    1. Open the file named `docker-compose.yaml` in your code editor.
    2. Look for **Run All Services** button at the top of the `services:` section.
    3. Click that button to build and start both containers automatically.

    You should see this at the end in your terminal, indicating that the two containers are up and running.

    ```
    [+] Running 4/4
    ✔ db                                   Built                        0.0s 
    ✔ app                                  Built                        0.0s
    ✔ Container preseeded-postgres-db      Started                      0.8s 
    ✔ Container express-app                Started                      0.4s
    ```


### 3. Couple of Notes for Managing Your Local Database

**Important:** The seeded database is stored on your computer's local storage using Docker volumes. If you make any changes
(e.g. adding a message to a consultation), the change will persist between container restarts.

#### When you need a Fresh Database

If you want to reset the database back to its original seeded state:

**Step 1:** Check existing Docker volumes

This will list all Docker volumes on your system. You should see one named `telemed-consult-messages-backend-system_postgres-db` - this is where your database data lives.

```
docker volume ls
```

**Step 2:** Stop the running containers

```
docker compose down
```

Alternatively in Docker Desktop, click the **Stop** button for the container named **telemed-consult-messages-backend-system**.

**Step 3:** Delete the database volume

This will completely remove the stored database data from your computer.

```
docker volume rm telemed-consult-messages-backend-system_postgres-db
```

**Step 4:** Rebuild and restart

```
docker compose build
docker compose up
```

Alternatively, click **Run All Services** inside `docker-compose.yaml` in your editor.



## Sample Data

```
Consultation 1: Patient 4 with Doctor 2
- 5 messages back and forth about side effects from the new medication.

Consultation 2: Patent 3 and Doctor 1
- 10 messages back and forth about knee procedure.
```



## API Endpoints Documentation 

Please make sure Docker is running before testing the API Endpoints. I personally would prefer testing the API Endpoints with 
Postman, since it's quite easy to get started with because of their UI, and also because I can see the responses more clearly.

You could install Postman and sign up for an account

This documentation provides the information needed to use the API with any HTTP client (cURL, Postman, etc.). Examples show
the raw HTTP request format.

- [Add a Message to a Consultation](#add-a-message-to-a-consultation)
- [Get All Messages for a Consultation](#get-all-messages-for-a-consultation)

### Add a Message to a Consultation 

Add a new message from a user to a specific consultation.

#### Endpoint

```
POST http://localhost:8000/api/addConsultationMessage
```

#### Headers
```
Content-Type: application/json
```

#### Request Body JSON Parameters

| Parameter       | Type    | Required | Description                         |
| --------------- | ------- |--------- | ----------------------------------- |
| userId          | number  | Yes      | ID of the user sending the message  |
| consultationId  | number  | Yes      | ID of the consultation              |
| messageContent  | string  | Yes      | Content of the message              |

#### Request Body Example
```JSON
{
    "userId": 4,
    "consultationId": 1,
    "messageContent": "Hey Doc, the side effects have been persisting for more than two days. What should I do?"
}
```

#### Response

Status: `201 Created`

Returns the newly created message with timestamp and author details in JSON.

#### Response Example:
```JSON
{
    "consultation_id": 1,
    "author": "David Wang",
    "author_role": "Patient",
    "message_content": "Hey Doc, the side effects have been persisting for more than two days. What should I do?",
    "timestamp": "2025-10-25T02:49:32.940Z"
}
```


### Get All Messages for a Consultation

Retrieve all messages for a specific consultation, with optional filtering by author role.

#### Endpoint 

```
GET http://localhost:8000/api/getConsultationMessages/
```

#### Headers
```
Content-Type: application/json
```

#### Query Parameters

| Parameter       | Type    | Required  | Description                                             |
| --------------- | ------- | --------- | ------------------------------------------------------- |
| consultationId  | number  | Yes       | ID of the consultation                                  |
| authorRole      | string  | No        | Filter messages by user role (e.g. "Patient", "Doctor") |

#### Response 

Status: `200 OK`

Returns an array of JSON messages for the specified consultation.

#### Example 1: Get All Messages

**Request:**
```
GET http://localhost:8000/api/getConsultationMessages?consultationId=1
```

**Response:**
```JSON
[
    {
        "message_id": 1,
        "message_content": "Hi, I'm experiencing some side effects from the new medication",
        "time_sent": "2025-10-25T14:30:36.200Z",
        "user_id": 4,
        "consultation_id": 1,
        "user_full_name": "David Wang",
        "user_role": "Patient"
    },
    {
        "message_id": 2,
        "message_content": "Sorry to hear that. What kind of side effects are you noticing?",
        "time_sent": "2025-10-25T14:36:23.210Z",
        "user_id": 2,
        "consultation_id": 1,
        "user_full_name": "Isabella Chen",
        "user_role": "Doctor"
    },
    {
        "message_id": 3,
        "message_content": "I've been feeling dizzy and a bit nauseous since yesterday.",
        "time_sent": "2025-10-25T14:41:11.590Z",
        "user_id": 4,
        "consultation_id": 1,
        "user_full_name": "David Wang",
        "user_role": "Patient"
    },
    {
        "message_id": 4,
        "message_content": "Those can happen at first, try taking it with food. If it persists more than 2 days, let me know.",
        "time_sent": "2025-10-25T14:49:42.260Z",
        "user_id": 2,
        "consultation_id": 1,
        "user_full_name": "Isabella Chen",
        "user_role": "Doctor"
    },
    {
        "message_id": 5,
        "message_content": "Got it, I’ll do that. Thanks, doctor.",
        "time_sent": "2025-10-25T14:56:34.540Z",
        "user_id": 4,
        "consultation_id": 1,
        "user_full_name": "David Wang",
        "user_role": "Patient"
    }
]
```

#### Example 2: Filter Messages by Author Role

**Request:**
```
GET http://localhost:8000/api/getConsultationMessages?consultationId=1&authorRole=Patient
```

**Response:**
```JSON
[
    {
        "message_id": 1,
        "message_content": "Hi, I'm experiencing some side effects from the new medication",
        "time_sent": "2025-10-25T14:30:36.200Z",
        "user_id": 4,
        "consultation_id": 1,
        "user_full_name": "David Wang",
        "user_role": "Patient"
    },
    {
        "message_id": 3,
        "message_content": "I've been feeling dizzy and a bit nauseous since yesterday.",
        "time_sent": "2025-10-25T14:41:11.590Z",
        "user_id": 4,
        "consultation_id": 1,
        "user_full_name": "David Wang",
        "user_role": "Patient"
    },
    {
        "message_id": 5,
        "message_content": "Got it, I’ll do that. Thanks, doctor.",
        "time_sent": "2025-10-25T14:56:34.540Z",
        "user_id": 4,
        "consultation_id": 1,
        "user_full_name": "David Wang",
        "user_role": "Patient"
    },
    {
        "message_id": 17,
        "message_content": "I'm feeling better now! Thank you so much for the check-in?",
        "time_sent": "2025-10-25T22:48:18.890Z",
        "user_id": 4,
        "consultation_id": 1,
        "user_full_name": "David Wang",
        "user_role": "Patient"
    }
]
```

## Architecture Decisions

### Data Model:

- *How did you structure your data?*

    My data is structured in relational tables because I want to enforce data integrity, which is vital in healthcare systems. 

- *What fields did you include and why?*

    Upon reading the required functionalities around storing and retrieving messages. I identified the key nouns mentioned:
    - consultation
    - messages
    - user

    With these information so far, I have been able to determine 3 entities (i.e. tables) - `consultation`, `message`, and `consult_user`. 

    According to the **Required Functionality**, we must be able to identify who sent the message, and their role in the consultation, because a consultation comprises either a doctor or a patient. With this information, I decided on 3 attributes for the 
    `consult_user` entity - `user_id`, `user_full_name`, and `user_role`. I believe that having 1 entity is enough instead of splitting out 
    doctor or patient entity, since the `user_role` in the entity will determine whether the person is a Doctor or a Patient.

    Given the first **Store Messages Functionality**, I made some assumptions that if we are able to add messages to a consultation, 
    we need to know what consultation we need to add to, therefore we should have the attribute `consultation_id` for `consultation` entity.

    As for the message entity, which is a bit more complicated than the two other entities. I want to mention that the reason why this entity
    is not `messages` but `message` is because:
    - A consultation can have many messages.
    - A message belongs to a consultation.
    - A message is sent by 1 sender (either Patient or Doctor).
    - A message is received by 1 receiver (either Patient or Doctor, depending on who sent first).

    Based on that observation, I identified that we need the following attributes for the `message` entity:
    - `message_id`: This is a primary key, and each message has to have their own unique ID as there could be a lot of messages with the same contents.
    - `consultation.consultation_id`: This is a foreign key from the primary key of the `consultation_id` (More explanation on this below).
    - `consult_user.user_id`: The message is associated to a user, therefore it'd be best to have the foreign key from the primary key `user_id` here to later identify which of the messages are from Doctor or Patient of a consultation.
    - `message_content`: If we want to send a message, we obviously want to include the contents of the message.
    - `time_sent`: There needs to be a time value to keep track of when a message is sent.

- *How did you model the relationship between consultations and messages?*

    I first observed that a message belongs to a consultation, so I was thinking maybe we should have the `message.message_id` as a foreign key inside 
    the `consultation` table. However, I quickly realized that there could only be unique consultation IDs, and that the consultation table would have to store an array of message IDs of some sort, which is unsupported in my database and not very practical either, because what if in a consultation, we have hundreds or thousands of messages exchanged - that would cause a lot of issues. Therefore, I came up with a solution for this 
    one-to-many (consultation to many messages) relationship, that is to go the other way around, we would store the `consultation_id` as a foreign key inside the `message` table, therefore mapping each message to its own consultation. 

- *What would you index if this were a real database?*

    In my current database, which is only intended for local development purposes and not production code, I did think about why we would index, and if we do index, which column to index, since one of the the challenge statements for the `GET` endpoint was to filter by author role. Indexes are beneficial for performance purposes but if we don't index the right column, it will cost performance way more. Because if we are writing something to the table, say `INSERT` or `UPDATE` statements, and the column that we indexed on is something that gets changed often, then we not only have to update the table rows, but also the indexed column. Therefore making it even slower when we're just trying to READ something.

    And therefore, it's generally better to index on a column that won't be used for writing operations. I chose to index on the `user_id` column of the `message` table, since it's generally good to index foreign keys of a child table (where those keys are primary keys in the parent table), and also because we would have to **retrieve all messages of a consultation with the optional choice of filtering by author role**, we would often have to do `JOIN` statements, by having the index, it will ultimately give us a faster performance.

    And as a response to this question, in a real database, where it is actually much larger than the one intended for this coding challenge, I would index all the foreign keys of a table to retrieve data from the parent tables faster. However, I would also monitor the query performance in production to see if the indexes are causing any overhead to write operations.

### Technology Choices:

- *Why did you choose this language/framework?*

    The tech stack for this backend coding challenge is *Node.js, Express, PostgreSQL and Docker*

    - I chose **Node.js with Express** because I'm most comfortable with JavaScript/Node.js, which meant I could focus on solving the problem 
    itself rather than struggling with syntax or framework given the time limit. Furthermore, Express is a fast, minimalist web backend 
    framework for Node.js, it is built on top of Node.js and makes building API endpoints much easier.

- *Why this storage approach?*

    - I went with **PostgreSQL** because it's a relational database, and the challenge's data seem to have clear relationships (consultations -> messages, users -> messages). Initially I wanted to go with SQLite because it doesn't need a server setup, and it's good for the simplicity of this project, but
    due to the time, I didn't go with SQLite, and went with something I'm more used to. 
        + Another plus to using PostgreSQL is because of its' ACID compliance, as it is crucial for medical data where you can't afford to lose messages or 
        have inconsistent data.

    - An add-on I really like for this project is **Docker**, since Docker does all the work of bundling the dependencies of application for you, and you just need to run the containers, then it also works on another person's computer. I really like Docker because of the ease of setup for everybody. And also the fact that developers cloning this wouldn't have to download PostgreSQl and do all the database set up, through running Docker, a PostgreSQL image with pre-seeded data using Docker Volumes will be created, and be ready for local development. So Docker is just really good for local development.
        + **More about Docker Volumes:** Volumes are persistent data stores for containers, created and managed by Docker. When you create a volume, it's stored within a directory on the Docker host. (references: [Docker Volumes](https://docs.docker.com/engine/storage/volumes/))

- *What trade-offs did you make given the time limit?*

    - **Authentication/Authorization:** I skipped user authentication entirely to focus on the core functionality. In a real medical application, this would be absolutely critical, because you'd need strong authentication (MFA) and strict role-based access control to ensure data security by controlling which authenticated users can perform specific actions and access certain data.
    - **HIPAA Compliance:** HIPAA's Security Rule requires healthcare organizations to implement technical safeguards like encryption to protect patient data. I wasn't able to work on this, and completely skipped this because of the time limit.
    - **Input validation:** I implemented basic error handling, but in production, I'd want more comprehensive validation.
    - **Testing:** I manually tested the endpoints, but didn't write any automated unit or integration tests.
    - **Seed script:** I used a `seed.sql` script to populate the PostgreSQL image, this is not really recommended because it could lead to data loss,
    difficulty in undo-ing changes, and idempotency issues.
    - I did not have a lot of comments in the code to give clearer explanations.
    - Would be a good idea to have a proper `.env` file for more secured containerization with Docker and connection pooling in Express.


## Production Readiness Plan

If I were to deploy this to production as a medical messaging application, here are the key improvements I'd make:

**Security:**
- As mentioned above, it is crucial to have strong authentication with multi-factor authentication (MFA) required for all users.
- Make sure users can only access their own consultations (check user ID before returning data).
- Use HTTPS instead of HTTP.
- Hashed passwords properly if storing user credentials.
- Use rate limiting and other methods to protect APIs from brute-force and denial-of-service (DoS) attack.
- Add a comprehensive test suite for input validation and testing.

**Performance:**
- Maybe add index on `time_sent` since sorting by time would be helpful.
- Implement WebSockets for real-time message delivery instead of polling-way, since it's more efficient for a messaging app.

**Reliability:**
- Set up automated database backups (daily snapshots).
- Add basic logging so we can see what went wrong when things break.
- Test the backup restoration process to make sure backups actually work.
- Disaster recovery for critical systems.

**Scalability:**
- Use environment variables for configuration so it's easy to deploy to different environments.
- Run multiple instances of the app behind a load balancer if traffic increases.
- *This is where I'd need to learn more, I understand some concepts in AWS but deploying the system to AWS will require a lot of work, as there are a lot of security concerns when it comes to deploying medical data to the Cloud*.

**Data Integrity:**
- Add NOT NULL constraints to required fields in the database
- Add foreign key constraints so we can't have messages pointing to non-existent consultations

**Compliance:**
- Encrypt data in transit (HTTPS/TLS).
- Encrypt sensitive data at rest in the database.
- Add audit logs tracking who accessed what patient data and when.
- Implement session timeouts (auto-logout after inactivity).

I know there's a lot I haven't covered here, and honestly, deploying a medical application to production would require expertise I'm still building. But I understand the *types* of problems that need to be solved, and I'm eager to learn the right way to solve them, especially given how important reliability and security are in healthcare.
