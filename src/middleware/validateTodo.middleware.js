```javascript
/**
 * C. Custom Validation Middleware (Route-Specific Middleware)
 * 
 * Type: Custom middleware
 * Applied to: POST /todos/add
 * 
 * Validation Rules:
 * - Request body must contain only: { "title": "string" }
 * 
 * Conditions:
 * - title must be present
 * - No additional fields are allowed
 * 
 * Reject request if:
 * - title is missing
 * - Any extra property is present in the request body
 * 
 * Accept request and call next() if validation passes
 * 
 * Error Response Example:
 * {
 *   "error": "Invalid request body. Only 'title' is allowed"
 * }
 */

const validateTodoMiddleware = (req, res, next) => {
  const { body } = req;

  // Check if body exists
  if (!body || Object.keys(body).length === 0) {
    return res.status(400).json({
      error: "Invalid request body. Only 'title' is allowed"
    });
  }

  // Check if title is present
  if (!body.title) {
    return res.status(400).json({
      error: "Invalid request body. Only 'title' is allowed"
    });
  }

  // Check if title is a string
  if (typeof body.title !== 'string') {
    return res.status(400).json({
      error: "Invalid request body. Only 'title' is allowed"
    });
  }

  // Get all keys from body
  const bodyKeys = Object.keys(body);

  // Check if there are any extra fields besides 'title'
  if (bodyKeys.length > 1 || bodyKeys[0] !== 'title') {
    return res.status(400).json({
      error: "Invalid request body. Only 'title' is allowed"
    });
  }

  // Validation passed, continue to route handler
  next();
};

module.exports = validateTodoMiddleware;
```
