# Routes Folder

This folder contains route definitions that map HTTP requests to controller functions.

For example:
- authRoutes.js: Defines routes related to authentication like login, register, and logout.
- protectedRoutes.js: Defines routes that require authentication (dashboard should be the only one).

Each route file should group related routes together and then call the appropriate controller.

Remember to specify routes in server.js