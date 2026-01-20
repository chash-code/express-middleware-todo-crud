# Express Middleware Todo CRUD

A RESTful API built with Express.js featuring CRUD operations for Todos with three types of middleware implementation.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. The server will run on http://localhost:3000

## Middleware Implementation

### A. Logging Middleware (App-Level Middleware)
- **Type**: App-level middleware
- **Applied to**: All incoming requests
- **Functionality**: 
  - Logs HTTP Method
  - Logs Request URL
  - Logs Timestamp
- **Usage**: `app.use(loggerMiddleware)`

**Example Log:**
```
[2026-01-13T20:15:12.000Z] GET /todos
```

### B. Rate Limiting Middleware (Route-Level Middleware)
- **Type**: Route-level middleware
- **Applied to**: `GET /todos` only
- **Rules**: 
  - Allow maximum 15 requests per minute
  - If limit exceeded: Respond with HTTP 429
  - Message: "Too many requests, please try again later"
- **Note**: Does NOT affect other Todo routes

### C. Custom Validation Middleware (Route-Specific Middleware)
- **Type**: Custom middleware
- **Applied to**: `POST /todos/add`
- **Validation Rules**:
  - Request body must contain only `{ "title": "string" }`
  - `title` must be present
  - No additional fields allowed

**Reject if:**
- `title` is missing
- Any extra property is present

**Error Response:**
```json
{
  "error": "Invalid request body. Only 'title' is allowed"
}
```

## API Endpoints

### Todo Routes (All inside Todo Router)

#### Create Todo
- **POST** `/todos/add`
- **Middleware**: Validation middleware
- **Body**: `{ "title": "string" }`

**Example:**
```bash
curl -X POST http://localhost:3000/todos/add \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn middleware"}'
```

#### Get All Todos
- **GET** `/todos`
- **Middleware**: Rate limiting middleware (15 req/min)

**Example:**
```bash
curl http://localhost:3000/todos
```

#### Get Single Todo
- **GET** `/todos/:todoId`
- **No middleware**

**Example:**
```bash
curl http://localhost:3000/todos/1
```

#### Update Todo
- **PUT** `/todos/update/:todoId`
- **Uses params** for update

**Example:**
```bash
curl -X PUT http://localhost:3000/todos/update/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated title","completed":true}'
```

#### Delete Todo
- **DELETE** `/todos/delete/:todoId`
- **Uses params** for delete

**Example:**
```bash
curl -X DELETE http://localhost:3000/todos/delete/1
```

## Testing Middleware

### Test Logging Middleware
All requests will be logged automatically:
```bash
curl http://localhost:3000/todos
# Check console: [2026-01-13T20:15:12.000Z] GET /todos
```

### Test Rate Limiting
Make more than 15 requests in a minute to GET /todos:
```bash
for i in {1..20}; do curl http://localhost:3000/todos; done
# After 15th request, you'll get HTTP 429
```

### Test Validation Middleware
**Valid request:**
```bash
curl -X POST http://localhost:3000/todos/add \
  -H "Content-Type: application/json" \
  -d '{"title":"Valid todo"}'
# Response: 201 Created
```

**Invalid request (missing title):**
```bash
curl -X POST http://localhost:3000/todos/add \
  -H "Content-Type: application/json" \
  -d '{}'
# Response: 400 Bad Request
```

**Invalid request (extra field):**
```bash
curl -X POST http://localhost:3000/todos/add \
  -H "Content-Type: application/json" \
  -d '{"title":"Todo","description":"Extra field"}'
# Response: 400 Bad Request
```
