# ContentForge AI

ContentForge AI is a full-stack MERN AI SaaS application for generating resumes, professional emails, and blog content with live streaming responses, authenticated user workspaces, saved history, and usage tracking.

The current UI branding inside the app uses `ContentAI`, while this repository is prepared as a production-ready recruiter-friendly codebase for GitHub and deployment.

## Demo

Live demo: `Coming soon`

Frontend preview URL: `Add your Vercel URL here`

Backend API URL: `Add your Render/Railway URL here`

## Screenshots

<p align="center">
<table>
  <tr>
    <td><img width="400" alt="Screenshot (1792)" src="https://github.com/user-attachments/assets/b2865cb5-d316-402c-b7b9-8a72b82c8b1e" /></td>
    <td><img width="400" alt="Screenshot (1796)" src="https://github.com/user-attachments/assets/84d14f0e-935e-4a3a-acf7-7199e673cfd3" /></td>
  </tr>
  <tr>
    <td><img width="400" alt="Screenshot (1799)" src="https://github.com/user-attachments/assets/023504d4-6f52-407c-b89f-b9b3a5d38a1e" /></td>
    <td><img width="400" alt="Screenshot (1801)" src="https://github.com/user-attachments/assets/dce0c9d6-a8a0-4574-b10b-30344800cb51" /></td>
  </tr>
  <tr>
    <td><img width="400" alt="Screenshot (1786)" src="https://github.com/user-attachments/assets/2c69e8dd-4743-44f1-9821-e117af66e5d0" /></td>
    <td><img width="400" alt="Screenshot (1789)" src="https://github.com/user-attachments/assets/be46a133-7647-477d-ae56-1e656a0670f6" /></td>
  </tr>
  <tr>
    <td><img width="400" alt="Screenshot (1787)" src="https://github.com/user-attachments/assets/41975dd3-673d-4fd1-8559-8ddc746dfa37" /></td>
    <td><img width="400" alt="Screenshot (1791)" src="https://github.com/user-attachments/assets/66bbe75e-e57f-4ddb-a83b-509fa5dce8dd" /></td>
  </tr> 
</table>
</p>

## Features

- JWT authentication with registration, login, and protected routes
- Resume, email, and blog generation workflows
- Real-time streaming output using SSE
- Refine and regenerate flow without changing the frontend contract
- Saved generation history with view, copy, export, and delete actions
- Usage tracking and free-tier limits
- Responsive React + Tailwind UI
- Theme support and local pinned drafts

## Tech Stack

### Frontend

- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- Fetch API for streaming

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Google Gemini via the OpenAI-compatible endpoint

## Folder Structure

```text
ContentForge-AI/
├─ client/
│  ├─ public/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ context/
│  │  ├─ hooks/
│  │  ├─ pages/
│  │  ├─ services/
│  │  ├─ utils/
│  │  ├─ App.jsx
│  │  ├─ index.css
│  │  └─ main.jsx
│  ├─ .env.example
│  ├─ index.html
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ tailwind.config.js
│  ├─ vercel.json
│  └─ vite.config.js
├─ server/
│  ├─ config/
│  ├─ controllers/
│  ├─ middleware/
│  ├─ models/
│  ├─ routes/
│  ├─ services/
│  ├─ .env.example
│  ├─ package.json
│  └─ server.js
├─ .gitignore
└─ README.md
```

## Environment Setup

### Server `.env`

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Client `.env`

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Local Installation

### 1. Clone the repository

```bash
git clone https://github.com/ScriptSavvy06/ContentForge-AI.git
cd ContentForge-AI
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

## Run Locally

### Start backend

```bash
cd server
npm run dev
```

### Start frontend

```bash
cd client
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## MongoDB Setup

1. Create a MongoDB Atlas cluster.
2. Create a database user with read/write access.
3. Add your current IP address for local development.
4. Copy the connection string into `MONGODB_URI`.
5. Replace username, password, and database name as needed.

## Gemini API Setup

1. Create a Google AI Studio or Gemini API project.
2. Generate an API key.
3. Add the key to `server/.env` as `GEMINI_API_KEY`.
4. Restart the backend after updating environment variables.

## Deployment Overview

Recommended split deployment:

- Frontend: Vercel
- Backend API: Render or Railway
- Database: MongoDB Atlas

This keeps the React frontend fast on Vercel and avoids forcing the Express SSE backend into a serverless shape that could complicate streaming behavior.

## Frontend Deployment on Vercel

### Recommended Vercel settings

- Import the GitHub repository into Vercel
- Set the project Root Directory to `client`
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

### Frontend environment variable

Set this in Vercel:

```env
VITE_API_URL=https://your-backend-api-domain/api
```

### SPA routing

The project includes `client/vercel.json` so React Router routes resolve correctly on refresh in production.

## Backend Deployment on Render or Railway

### Recommended backend settings

- Root directory: `server`
- Install command: `npm install`
- Start command: `npm start`

### Required backend environment variables

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=https://your-frontend-vercel-domain.vercel.app
NODE_ENV=production
```

## Production Notes

- `VITE_API_URL` must point to the deployed backend `/api` base path.
- `CLIENT_URL` must match the deployed frontend domain so CORS allows production requests.
- Keep `.env` files out of Git. Only commit `.env.example`.
- Do not commit `node_modules`, `dist`, or local editor settings.
- SSE streaming is preserved and should be tested after deployment from the generator page.

## API Summary

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in a user |
| GET | `/api/auth/me` | Get authenticated user |
| GET | `/api/user/stats` | Get user dashboard stats |
| POST | `/api/generate/resume` | Stream resume output |
| POST | `/api/generate/email` | Stream email output |
| POST | `/api/generate/blog` | Stream blog output |
| GET | `/api/history` | Get generation history |
| GET | `/api/history/:id` | Get a saved generation |
| DELETE | `/api/history/:id` | Delete a saved generation |

## Security Checklist

- `.env` files are ignored
- Only `.env.example` files are intended for Git
- Build output is ignored
- Local dependencies are ignored
- Frontend uses `VITE_API_URL`
- Backend CORS is controlled by `CLIENT_URL`

## Recruiter Notes

This project demonstrates:

- Full-stack MERN architecture
- Authenticated SaaS workflow design
- AI API integration with streaming
- Environment-based configuration
- Deployment-oriented repository hygiene
- Separation of frontend and backend delivery concerns

## License

MIT
