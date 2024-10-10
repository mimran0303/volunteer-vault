## Project Description
This project is aimed at designing a software application for a non-profit organization to optimize its volunteer management efforts. The application will facilitate the efficient allocation of volunteers to various events and tasks by considering their skills, preferences, and availability. This initiative aims to enhance volunteer engagement and improve the overall coordination of volunteer activities.

## Prerequisites
Before setting up the project, ensure you have the following installed on your machine:
- **Node.js** `^v22.2.0`
- **npm** `^10.7.0`

## Installation Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Gmenaa/volunteer-vault.git
cd <cloned-repository-folder>
```

### 2. Set Up the Environment Variables
- Using crypto.randomBytes(), create a JWT secret key. Simply run this script on the terminal:
```bash
node -e 
"console.log(require('crypto').randomBytes(32).toString('hex'))"
```
- Inside the root folder, create a `.env` file in the root directory and add the following line and copy your generated key.
```bash
JWT_SECRET_KEY=
```
- `\coverage` is where code coverage reports will be stored after running tests. Note that this directory is included in `.gitignore` to avoid committing coverage reports to the repository. Add the following line to the `.env` file.
```bash
/coverage
```

### 3. Install Dependencies
**Client-side Dependencies** \
Navigate to the client directory and install client-side dependencies:
```bash
cd client
npm install
```
This installs the following dependencies:
* **axios** `^1.7.7`
    + Promise-based HTTP client for making requests.
* **next** `^14.2.12`
    + A React framework for building server-side rendered or statically exported React apps.
* **react** `^18`
    + The core React library for building user interfaces.
* **react-dom** `^18`
    + Provides DOM-specific methods for React.
* **react-icons** `^5.3.0`
    + A library of popular icons for use in React projects.

**Server-side Dependencies** \
Navigate to the server directory and install server-side dependencies:
```bash
cd ../server
npm install
```
This installs the following dependencies:
* **bcrypt** `^5.1.1`
    + A library for hashing and salting passwords securely.
* **cookie-parser** `^1.4.6`
    + Middleware for parsing cookies in requests.
* **cors** `^2.8.5`
    +  Middleware for enabling Cross-Origin Resource Sharing.
* **dotenv** `^16.4.5`
    + Loads environment variables from a `.env` file into `process.env`.
* **express** `^4.21.0`
    +  A web framework for building RESTful APIs.
* **jsonwebtoken** `^9.0.2`
    + A library for creating and verifying JSON Web Tokens (JWT).

Additionally, the following development dependencies will be installed:
* **jest** `^29.7.0`
    + A testing framework for JavaScript.
* **nodemon** `^3.1.5`
    + A utility that automatically restarts the server when code changes are detected.
* **supertest** `^7.0.0`
    +  A library for testing HTTP endpoints.

### 4. Running the Project 
1. **Start the Client**
    + Open a terminal in the `client` directory and run:
    ```bash
    npm run dev
    ```
    This will start the client in development mode. The default URL is http://localhost:3000.


2. **Start the Server**
    + Open a terminal in the `server` directory and run:
    ```bash
    npm start
    ```
    This will start the server on http://localhost:8080 (or another specified port).

## Configuration Details
*  **Environment Variables**: The `.env` file contains sensitive information. Ensure it's never committed to version control.
*  **Port Configuration**: If you want to change the server port number, you can do so by updating the server's configuration file (`server.js`).

## Testing
* To run tests, navigate to the `server` directory and execute:
```bash
npm test
```
This will run the tests using Jest and Supertest. Code coverage reports will also be generated.

## Troubleshooting Tips
1. **Common Issues**:
    + **Port in Use**: If the server fails to start because the port is already in use, ensure no other process is running on that port, or change the port in the server configuration.
    + **Environment Variable Errors**: Make sure the `.env` file exists and contains the correct environment variables.
2. **Client Fails to Start**:
    + Ensure dependencies are correctly installed with `npm install`.
    + If there's an error related to Next.js, try deleting the `.next` directory and rerunning `npm run dev`.
3. **Server Crashes on Start**:
    + Ensure dependencies are correctly installed with `npm install`.
    + Ensure the environment variable (`JWT_SECRET_KEY`) is set up correctly.
    + Use `npm run dev` with nodemon for easier debugging during development.