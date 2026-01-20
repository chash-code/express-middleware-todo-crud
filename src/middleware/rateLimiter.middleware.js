```javascript
/**
 * B. Rate Limiting Middleware (Route-Level Middleware)
 * 
 * Type: Route-level middleware
 * Applied to: GET /todos
 * 
 * Rules:
 * - Allow maximum 15 requests per minute
 * - If limit exceeded: Respond with HTTP 429
 * - Message: "Too many requests, please try again later"
 * 
 * Note: This middleware should NOT affect other Todo routes
 */

// Store request counts per IP
const requestCounts = new Map();

// Reset counts every minute
setInterval(() => {
  requestCounts.clear();
}, 60000); // 60000ms = 1 minute

const rateLimiterMiddleware = (req, res, next) => {
  // Get client IP (use x-forwarded-for in production)
  const clientId = req.ip || req.connection.remoteAddress || 'unknown';

  // Get current count for this client
  const currentCount = requestCounts.get(clientId) || 0;

  // Check if limit exceeded
  if (currentCount >= 15) {
    return res.status(429).json({
      error: "Too many requests, please try again later"
    });
  }

  // Increment count
  requestCounts.set(clientId, currentCount + 1);

  // Log current usage
  console.log(`Rate limit - Client: ${clientId}, Count: ${currentCount + 1}/15`);

  // Continue to route handler
  next();
};

module.exports = rateLimiterMiddleware;
```
