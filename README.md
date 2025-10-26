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

Once Docker is installed, choose one of the following options to run the project locally:
- [Option 1: Using Terminal or Command Line](#option-1-build-and-run-with-docker-compose-using-terminal-or-command-line)
- [Option 2: Using `docker-compose.yaml`](#option-2-using-docker-composeyaml)

    ### Option 1: Build and Run with Docker Compose using Terminal or Command Line

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

    Launche both services (express server and postgresql database) from the `docker-compose.yaml` file

    ```
    docker compose up
    ```

    #### Step 4: Verify Containers are Running

    Check that both containers (preseeded-postgres-db and express app) started sucessfully.

    ```
    docker ps
    ```

    And you should see something quite similar like the following:

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

## Production Readiness Plan

## Reflection
> If time permits...