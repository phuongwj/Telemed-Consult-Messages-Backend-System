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

    ```
    ```

    #### Step 4: Verify Containers are Running

    Open a separate terminal to check that both containers (preseeded-postgres-db and express app) started sucessfully.

    ```
    docker ps
    ```

    And you should see something similar to the following:

    | CONTAINER ID | IMAGE | COMMAND | CREATED | STATUS| PORTS| NAMES |
    |---------------|----------------------------------------------------|---------------------------|------------------|--------------|-----------------------------------------------|------------------------|
    | 6c341f37e6c2  | telemed-consult-messages-backend-system-backend    | "docker-entrypoint.s…"    | 17 seconds ago   | Up 5 seconds | 0.0.0.0:8000->8000/tcp, [::]:8000->8000/tcp   | express-app            |
    | 2220187be40e  | telemed-consult-messages-backend-system-database   | "docker-entrypoint.s…"    | 18 seconds ago   | Up 6 seconds | 0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp   | preseeded-postgres-db  |


    #### Step 5: Stop the Containers

    If you want to stop running the containers

    ```
    docker compose down
    ```

    ### Option 2: Using `docker-compose.yaml`

    1. Open the fil named `docker-compose.yaml` in your code editor.
    2. Look for **Run All Services** button at the top of the `services:` section.
    3. Click that button to build and start both containers automatically.

    **Note:** This option will provide the same result as Option 1, but much simpler.

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

This will completely removes the stored database data from your computer.

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

Please make sure Docker is running before testing the API Enpoints. I personally would prefer testing the API Endpoints with 
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

- *How did you structure your data?*

    My data is structured in relational tables.

- *What fields did you include and why?*

    Upon reading the required functionalities around storing and retrieving messages. I indentified the key nouns mentioned:
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
    the `consultation` table. However, I quickly realized that there could only be unique consultation ids, and that the consultation table would have to store an array of message ids of some sort, which is unsupported in my database and not very practical either, because what if in a consultation, we have hundreds or thousands of messages exchanged, that would cause a lot of issues. Therefore, I came up with a solution for this 
    one-to-many (consultation to many messages) relationship, that is to go the other way around, we would store the `consultation_id` as a foreign key inside the `message` table, therefore mapping each message to its' own consultation. 

- *What would you index if this were a real database?*

    In my current database, which is only intended for local development purposes and not production code, I did think about why we would index, and if we do index, which column to index, since one of the the challenge statements for the `GET` endpoint was to filter by author role. Indexes are beneficial for performance purposes but if we don't index the right column, it will cost performance way more. Becauase if we are writing something to the table, say `INSERT` or `UPDATE` statements, and the column that we indexed on is something that gets changed often, then we not only have to update the table rows, but also the indexed column. Therefore making it even slower when we're just trying to READ something.

    And therefore, it's generally better to index on a column that won't be used for writing operations. I chose to index on the `user_id` column of the `message` table, since it's generally good to index foreign keys of a child table (where those keys are primary keys in the parent table), and also because we would have to **retrieve all messages of a consultation with the optional choice of filtering by author role**, we would often have to do `JOIN` statements, by having the index, it will ultimately give us a faster performance.

    And as a response to this question, in a real database, where it is actually much larger than the one intended for this coding challenge, I would index all the foreign keys of a table to retrieve data from the parent tables faster. 

### Technology Choices:

- *Why did you choose this language/framework?*

    The tech stack for this backend coding challenge is *Node.js, Express.js, PostgreSQL and Docker*


### Data Model:

## Production Readiness Plan

## Reflection
> If time permits...