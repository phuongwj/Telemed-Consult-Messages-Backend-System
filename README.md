# Backend Message Storage System for Telemedicine Consultations

## Setup Instructions

## Sample Data

## API Documentation 

This documentation provides the information needed to use the API with any HTTP client (cURL, Postman, etc.). Examples show
the raw HTTP request format.

- [Add a Message to a Consultation](#add-a-message-to-a-consultation)
- [Get All messages for a Consultation](#get-all-messages-for-a-consultation)

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

### Technology Choices:

## Production Readiness Plan