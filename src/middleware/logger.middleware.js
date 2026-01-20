```javascript
/**
 * A. Logging Middleware (App-Level Middleware)
 * 
 * Type: App-level middleware
 * Applied to: All incoming requests
 * 
 * Functionality:
 * - Logs HTTP Method
 * - Logs Request URL
 * - Logs Timestamp
 */

const loggerMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;

  // Log format: [2026-01-13 20:15:12] GET /todos
  console.log(`[${timestamp}] ${method} ${url}`);

  // Continue to next middleware/route handler
  next();
};

module.exports = loggerMiddleware;
```
