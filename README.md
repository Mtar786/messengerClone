# Messenger Clone (MERN + Socket.io)

This project is a simple clone of a chat application built with the MERN stack (MongoDB, Express.js, React, Node.js) and Socket.io for real‑time messaging.  It demonstrates how to set up a modern full‑stack application with authentication, persistent data storage and WebSocket‑based chat.

## Features

- **User registration and login.**  New users can register with a unique username and email.  Passwords are hashed using bcrypt before being stored.  The registration flow checks for missing fields and existing users before saving【444182637821624†L126-L148】.
- **Real‑time messaging.**  The server uses Socket.io to maintain a list of connected users and forwards messages to recipients in real time【444182637821624†L190-L218】.
- **Persistent conversations.**  Conversations and messages are stored in MongoDB using Mongoose models.  Conversations are queried using `$in` to find chats a user participates in【444182637821624†L157-L160】.
- **JWT authentication.**  Upon login, the server returns a JSON Web Token that the client stores locally for authenticated requests.
- **Simple React UI.**  The front‑end provides pages for login, registration and a messenger view that lists conversations and displays messages.  Users can send and receive messages without reloading the page.

## Prerequisites

- [Node.js](https://nodejs.org/) and npm installed.
- A running MongoDB instance (local or remote).  You can set the connection string in the `.env` file inside the `server` folder.

## Getting Started

1. **Install backend dependencies and start the API server.**  From the project root, navigate to the `server` directory, install packages and start the server:

   ```bash
   cd messenger-app/server
   npm install
   # Copy the provided `.env` example or create your own and set MONGO_URI and JWT_SECRET
   cp .env .env.local # optional: rename or edit as needed
   npm start
   ```

   The server listens on port `5000` by default and connects to your MongoDB database.

2. **Install front‑end dependencies and run the React app.**  In a separate terminal, navigate to the `client` folder and run:

   ```bash
   cd messenger-app/client
   npm install
   npm start
   ```

   The React development server runs on port `3000` by default.  Open your browser at `http://localhost:3000` and register a new account.

3. **Start chatting.**  After logging in, you can create new conversations by searching for users by ID (or by adding friends in the code) and send messages.  Messages are stored in MongoDB and delivered instantly to connected users via Socket.io.

## File structure

- `server` – Express application with Mongoose models, REST routes and Socket.io setup.
- `client` – React application with pages for authentication and the messenger interface.
- `.gitignore` – Ignores sensitive and unnecessary files (e.g. `node_modules`, `.env` files, log files).

Feel free to extend this project by adding features such as group chats, message notifications, user profiles or a better UI.
