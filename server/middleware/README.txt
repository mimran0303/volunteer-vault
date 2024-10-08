# Middleware Folder

This folder contains middleware functions that process requests before they reach the final route handlers.

For example:
- verifyToken.js: A middleware function that checks if a user is authenticated by verifying a JWT token BEFORE routing to the dashboard.

Put any reusable middleware logic here.