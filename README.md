# Chattrix

Chattrix is a full-stack chat application built with the MERN stack. It provides authenticated user accounts, private conversations, message management, profile customization, image uploads, and an AI chat interface powered by Google Gemini.

The project is organized as a separate React frontend and Express backend, with MongoDB used for persistent data storage.

[Live Demo](https://chattrix-frontend-ecru.vercel.app/)

## Screenshots

### Login
<img width="1920" height="922" alt="login" src="https://github.com/user-attachments/assets/7335b90b-03a6-4d9c-babe-d9a957f4dc98" />


### Chat
<img width="1920" height="922" alt="chat" src="https://github.com/user-attachments/assets/142e3cca-3bb6-4175-9be4-20019fb8fae1" />


### Real-Time Messaging
<img width="1920" height="922" alt="real-time-chat" src="https://github.com/user-attachments/assets/f4298f07-1b5f-498b-9bdf-8ef56cfc9e49" />


## Features

* User registration and login
* JWT-based authentication
* Protected application routes
* Private user conversations
* Conversation list with unread message tracking
* Message sending and retrieval
* Message delivery and read status
* Message deletion
* Reply-to-message support
* Image messages
* User search
* Online and last-seen status
* Typing indicators
* Profile editing
* Profile image upload and removal
* AI conversations powered by Google Gemini
* AI conversation history
* AI conversation history clearing
* Markdown rendering for AI responses
* API rate limiting
* HTTP security headers with Helmet
* Request validation
* Centralized error handling
* Responsive React interface
* Toast notifications
* Redux state management

## Tech Stack

### Frontend

* React
* React Router
* Redux Toolkit
* React Redux
* Axios
* Tailwind CSS
* Vite
* Lucide React
* React Hot Toast
* React Markdown
* Socket.IO Client

### Backend

* Node.js
* Express
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Socket.IO
* Google Generative AI SDK
* Cloudinary
* Express Validator
* Express Rate Limit
* Helmet
* CORS
* dotenv

## Architecture

Chattrix uses a separate frontend and backend architecture.

```text
chattrix/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── socket/
│   │   ├── utils/
│   │   ├── validations/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
└── LICENSE
```

## Application Structure

### Frontend

The frontend is a Vite-powered React application.

The main areas of the frontend are:

```text
src/
├── components/
│   ├── chat/
│   ├── common/
│   └── layout/
├── lib/
├── pages/
│   ├── Auth/
│   ├── Home/
│   └── Profile/
├── redux/
│   ├── Slices/
│   └── store.js
├── services/
└── utils/
```

The application uses Redux Toolkit for authentication and user-related client state. API communication is centralized through Axios services, while protected routes prevent unauthenticated access to application pages.

### Backend

The backend follows a layered Express architecture:

```text
Request
   ↓
Route
   ↓
Middleware
   ↓
Controller
   ↓
Service
   ↓
Model
   ↓
MongoDB
```

Controllers handle HTTP requests and responses, while services contain the main application logic. Mongoose models define the MongoDB data structures.

## Authentication

Chattrix uses JWT-based authentication.

The authentication flow is:

```text
User
  ↓
Login / Register
  ↓
Backend validates credentials
  ↓
JWT generated
  ↓
Frontend stores authentication state
  ↓
JWT sent with protected API requests
  ↓
Authentication middleware validates token
  ↓
Protected resource
```

Passwords are hashed using `bcryptjs` before being stored.

Protected backend routes use authentication middleware to verify the user's identity before accessing user, conversation, message, and AI resources.

## Messaging

Messages are stored in MongoDB using the `Message` model.

A message can contain:

* Text
* Image
* Sender information
* Conversation information
* Delivery status
* Read status
* Reply reference
* Deletion information
* Sender type

Supported message statuses are:

```text
sent
delivered
read
```

Messages also support deletion for an individual user and deletion for everyone.

## Conversations

Conversations are stored separately from messages.

A conversation contains:

* Participants
* Last message reference
* Per-user unread counts
* AI conversation state
* Deleted-for information
* Creation and update timestamps

MongoDB indexes are used for commonly queried conversation fields.

## AI Chat

Chattrix includes a dedicated AI conversation system powered by Google Gemini.

AI conversations are stored using the same conversation and message infrastructure while being identified with the `isAIChat` property.

The AI workflow is:

```text
User sends prompt
      ↓
Backend validates request
      ↓
Conversation ownership is verified
      ↓
User message is stored
      ↓
Prompt is sent to Google Gemini
      ↓
AI response is generated
      ↓
AI response is stored as a message
      ↓
Conversation is updated
      ↓
Response returned to frontend
```

The backend uses the Google Generative AI SDK and reads the configured Gemini model from the environment.

AI requests are also protected by a dedicated rate limiter.

## User Profiles

Users can manage their personal profile information, including:

* Name
* Bio
* Profile image

Profile images are uploaded to Cloudinary and the resulting secure URL is stored with the user record.

The frontend validates image type and size before sending the image to the backend.

## Real-Time Communication

Socket.IO is implemented for local development and supports events such as:

* Online user tracking
* User online status
* User offline status
* Last-seen updates
* Typing indicators
* Stop-typing events
* User profile updates
* Message delivery events
* Message-related real-time events

The Socket.IO server is initialized by the Node.js server and uses JWT authentication for socket connections.

### Production Deployment Note

The production frontend is deployed separately from the backend.

The frontend is hosted on Vercel, while the Express backend and Socket.IO server are hosted on Bonto.

The production frontend connects to the Bonto backend for REST API requests and persistent Socket.IO communication.

This allows real-time features such as online status, typing indicators, message delivery, and read status to work in production.

## API

The backend exposes REST endpoints under the `/api` prefix.

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

### Users

```text
GET    /api/users
GET    /api/users/me
GET    /api/users/search
GET    /api/users/:id
PUT    /api/users/update
```

### Conversations

Conversation endpoints are available under:

```text
/api/conversations
```

### Messages

Message endpoints are available under:

```text
/api/messages
```

These endpoints handle message creation, retrieval, updating, deletion, read status, and related conversation operations.

### AI

```text
POST   /api/ai/conversation
POST   /api/ai/message
GET    /api/ai/history/:conversationId
DELETE /api/ai/history/:conversationId
```

All protected endpoints require authentication.

## Security

The backend includes several security measures:

* JWT authentication
* Password hashing with bcrypt
* Helmet security headers
* CORS configuration
* Express request validation
* API rate limiting
* Dedicated authentication rate limiting
* Dedicated AI rate limiting
* Input validation for user data
* Conversation ownership checks
* Message participant authorization
* Environment-based secret configuration

The application does not commit environment secrets to the repository.

## Environment Variables

### Backend

Create a `.env` file inside the `backend` directory.

Use `backend/.env.example` as the reference for required variables.

The backend requires configuration for:

```env
MONGODB_URI=
JWT_SECRET=
GEMINI_API_KEY=
GEMINI_MODEL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
FRONTEND_URL=
```

### Frontend

The frontend uses Vite environment variables.

For local development, configure the API and Socket.IO URLs according to your local backend.

Example:

```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=ws://localhost:3000
```

For production, configure the API URL to point to the deployed backend.

Do not commit `.env`, `.env.local`, or other files containing private credentials.

## Local Development

### Prerequisites

Install the following before running the project:

* Node.js
* npm
* MongoDB database
* Google Gemini API credentials
* Cloudinary account and API credentials

### Clone the Repository

```bash
git clone https://github.com/maaz-afzal/chattrix.git
cd chattrix
```

## Backend Setup

Move into the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```text
.env
```

Configure the required backend environment variables.

Start the development server:

```bash
npm run dev
```

The backend will run on the configured port, using port `3000` by default.

## Frontend Setup

Open another terminal and move into the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Configure the frontend environment variables.

Start the Vite development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

## Production Build

To create a production build of the frontend:

```bash
cd frontend
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

The backend can be started in production mode with:

```bash
cd backend
npm start
```

## Deployment

The current project is structured as two separately deployed applications.

### Frontend

The React frontend can be deployed as a Vite application.

The repository frontend directory is:

```text
/frontend
```

### Backend

The Express backend is deployed separately.

The repository backend directory is:

```text
/backend
```

The backend requires all production environment variables to be configured in the hosting platform.

MongoDB must also allow connections from the deployed backend environment.

Cloudinary credentials must have sufficient permissions for the operations used by the application.

## Error Handling

The backend uses centralized error handling through middleware.

Controllers pass errors to the error-handling middleware rather than implementing response formatting independently throughout the application.

The project also uses an `AppError` utility for application-level errors with explicit HTTP status codes.

## Rate Limiting

Different areas of the API use different rate limits.

The backend includes dedicated limiters for:

* Authentication
* General API requests
* AI requests

This helps reduce repeated requests to sensitive endpoints and limits excessive AI API usage.

## Database Models

The primary MongoDB models are:

### User

Stores account and profile information.

```text
User
├── name
├── email
├── password
├── bio
├── isOnline
├── lastSeen
├── profileImage
├── isDeleted
└── timestamps
```

### Conversation

Stores conversation-level information.

```text
Conversation
├── participants
├── lastMessage
├── unreadCount
├── isAIChat
├── deletedFor
└── timestamps
```

### Message

Stores individual messages.

```text
Message
├── conversationId
├── sender
├── text
├── image
├── status
├── deletedFor
├── deletedForEveryone
├── senderType
├── replyTo
└── timestamps
```

## Project Scripts

### Frontend

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run lint
```

Runs ESLint.

```bash
npm run preview
```

Previews the production build locally.

### Backend

```bash
npm run dev
```

Starts the backend with Nodemon.

```bash
npm start
```

Starts the backend with Node.js.

## Development Guidelines

When extending Chattrix, keep responsibilities separated between routes, controllers, services, and models.

A typical backend feature should follow this structure:

```text
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Model
```

Frontend API communication should remain inside the service layer rather than being distributed across unrelated components.

Authentication and authorization checks should be applied to every resource that contains user-specific data.

## Repository Structure

```text
chattrix/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── socket/
│   │   ├── utils/
│   │   ├── validations/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── LICENSE
└── README.md
```

## License

This project is licensed under the MIT License.

See the [LICENSE](LICENSE) file for the full license text.

## Repository

GitHub:

https://github.com/maaz-afzal/chattrix
