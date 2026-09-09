# Alumni Portal - IIIT Pune

A role-based alumni management platform for students, alumni, and administrators at IIIT Pune.

## Live Deployment

- Frontend: https://iiitptestalumniportal.netlify.app/auth
- Backend API: https://alumni-portal-deploy-backend.vercel.app/

## Overview

The portal streamlines alumni engagement through onboarding, profile management, job opportunities, event announcements, notices, and support ticket workflows.

## Key Features

- OTP-based signup and JWT authentication
- Role-based dashboards for Student, Alumni, and Admin
- Alumni directory and profile management
- Job postings, events, and notices
- Ticket-based support workflow
- Cloudinary media uploads and email notifications

## Tech Stack

- Frontend: React, Tailwind CSS
- Backend: Node.js, Express, MongoDB
- Integrations: Cloudinary, Nodemailer

## Getting Started

### 1) Backend Setup

```bash
cd server
npm install
```

Create `server/.env` with the following values:

```dotenv
PORT=4000
DB_URL=mongodb://localhost:27017/alumni_portal
JWT_SECRET=your-secret
CD_CLOUD_NAME=your-cloudinary-name
CD_API_KEY=your-cloudinary-key
CD_API_SECRET=your-cloudinary-secret
MAIL_HOST=smtp.example.com
MAIL_USER=your-email@example.com
MAIL_PASS=your-email-password
```

Run the backend server:

```bash
npm run dev
```

### 2) Frontend Setup

```bash
npm install
npm start
```

The frontend is configured to consume the API at `http://localhost:4000/api/v1` (see `src/App.js`).

## Project Structure

```text
server/  Express API, MongoDB models, authentication, uploads
src/     React application, pages, and reusable components
docs/    GitHub Pages-ready theme assets
```

## License

This project is licensed under the ISC License.