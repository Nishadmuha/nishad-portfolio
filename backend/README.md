# Portfolio Backend

This is the production-ready Node.js & Express backend API for the Portfolio website, optimized for deployment on [Render](https://render.com/).

## Features

- **Security**: Robust security headers with `helmet`, Gzip compression with `compression`, and API rate limiting on authentication routes with `express-rate-limit`.
- **CORS Protection**: Access control allowing local development servers and dynamic production domains through the `CLIENT_URL` environment variable.
- **Graceful Shutdown**: Handles process signals (`SIGINT`, `SIGTERM`) cleanly by closing HTTP servers and database connections to prevent memory leaks or hanging tasks.
- **Request Logging**: Automated request logging using `morgan` (detailed dev format in development, combined production format in production).
- **MongoDB Connection**: Resilient database connection logic with automated auto-seeding.
- **Dynamic File Uploads**: Integrated with **Cloudinary** for persistent remote asset uploads on Render's ephemeral filesystem, with a fallback to local disk storage for development.

---

## Prerequisites

- **Node.js** (v18.x or higher)
- **MongoDB Atlas** database URI
- **Cloudinary** account (for persistent production uploads)

---

## Getting Started

### 1. Installation
In the `backend` folder, run:
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

Define the variables:
```ini
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Run the Server
- **Development mode (with automatic hot-reloads via nodemon)**:
  ```bash
  npm run dev
  ```
- **Production mode**:
  ```bash
  npm start
  ```

---

## Production Deployment on Render

To deploy this backend API to **Render**, configure a new **Web Service** with the following options:

### 1. Service Settings
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: `Free` (or appropriate paid tier)

### 2. Environment Variables
Add the following key-value pairs under the **Environment** tab:

| Variable Name | Required | Description |
| :--- | :---: | :--- |
| `NODE_ENV` | Yes | Set to `production` |
| `PORT` | No | Render automatically sets this, but you can explicitly specify one |
| `MONGODB_URI` | Yes | Your MongoDB Atlas connection URI |
| `JWT_SECRET` | Yes | A long, secure random string for JWT signatures |
| `CLIENT_URL` | Yes | The URL of your deployed frontend (e.g. `https://your-portfolio.vercel.app`) |
| `CLOUDINARY_CLOUD_NAME` | Yes | Your Cloudinary Cloud Name |
| `CLOUDINARY_API_KEY` | Yes | Your Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | Yes | Your Cloudinary API Secret |

---

## API Documentation

### Root Endpoint
- **GET `/`**: Returns API connection status.
  ```json
  {
    "status": "ok",
    "message": "Portfolio Backend API is running"
  }
  ```

### Authentication Endpoints
- **POST `/api/auth/login`**: Authenticate administrator.
- **GET `/api/auth/verify`**: Verify JWT token status (requires Authorization header).

### Project Endpoints
- **GET `/api/projects`**: Get all projects.
- **POST `/api/projects`**: Create a project (Admin only).
- **PUT `/api/projects/:id`**: Update a project (Admin only).
- **DELETE `/api/projects/:id`**: Delete a project (Admin only).

### Settings & Portfolio Endpoints
- **GET `/api/portfolio`**: Fetch all portfolio settings and projects.
- **PUT `/api/settings`**: Update profile metadata and portfolio options (Admin only).

### Upload Endpoint
- **POST `/api/upload`**: Uploads a project banner/resume file (Admin only).
  - Returns either a secure Cloudinary URL (if configured) or a local static route.
