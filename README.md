<p align="center">
	<img src="https://capsule-render.vercel.app/api?type=rect&color=0:14532d,100:c59b2a&height=120&section=header&text=Alumni%20Portal%20-%20IIIT%20Pune&fontSize=30&fontColor=F8FAFC&fontAlignY=60" alt="Alumni Portal banner" />
</p>

<p align="center">
	<img src="https://img.shields.io/github/last-commit/TaranSuratwala/Alumni-Portal-IIIT-Pune?style=flat-square" alt="Last commit" />
	<img src="https://img.shields.io/github/languages/top/TaranSuratwala/Alumni-Portal-IIIT-Pune?style=flat-square" alt="Top language" />
	<img src="https://img.shields.io/github/repo-size/TaranSuratwala/Alumni-Portal-IIIT-Pune?style=flat-square" alt="Repo size" />
</p>

# Alumni Portal - IIIT Pune

Role-based alumni portal for students, alumni, and administrators. The platform supports onboarding, alumni directories, job posts, events, notices, and support tickets.

## Highlights

- OTP-based signup and JWT login
- Role-based dashboards for Student, Alumni, and Admin
- Job posts, events, notices, and ticket workflows
- Alumni directory and profile management
- Cloudinary image uploads and email notifications

## Tech Stack

- Frontend: React, Tailwind CSS
- Backend: Node.js, Express, MongoDB
- Integrations: Cloudinary, Nodemailer

## Site Theme

A GitHub Pages ready theme lives in `docs/`. Enable Pages to serve from the `/docs` folder.

## Quick Start

### Backend

```bash
cd server
npm install
```

Create `server/.env` with these keys:

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

Start the API server:

```bash
npm run dev
```

### Frontend

```bash
npm install
npm start
```

The frontend expects the API at `http://localhost:4000/api/v1` (see `src/App.js`).

## Project Structure

```
server/  Express API, MongoDB models, auth, uploads
src/     React app, pages, components
```

## License

ISC License