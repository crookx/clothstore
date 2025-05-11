# API Documentation

## Authentication Endpoints

### POST /api/auth/login
Authenticates a user and returns a session token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "role": "string"
  }
}
```