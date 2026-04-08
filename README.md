# Gym Progress Tracker

A full-stack web application for tracking gym workouts, logging progress, visualizing fitness data, and managing memberships — with an AI Gym Coach for Pro users.

## Features

### Core Features
- **User Authentication** – Register/login with JWT-based auth
- **Workout Plans** – Create and manage structured workout plans with exercises
- **Workout Logs** – Log daily workouts with sets, reps, weight, and duration
- **Progress Tracker** – Track weight, body fat, and body measurements over time
- **Dashboard** – Overview stats, charts (weight trend, weekly frequency), profile card
- **Admin Panel** – Admin users can view all registered users

### New Features (v2)
- **Home Page** – Landing page with hero section and feature overview
- **About Page** – Mission statement and what-we-offer cards
- **Community Page** – Community benefits and member stats
- **Contact Page** – Support contact info and inquiry form
- **Membership Plans** – Free / Premium / Pro tiers with functional plan switching
- **Workout Programs** – Browse 12 sample programs with muscle group + difficulty filters
- **AI Gym Coach** – Floating chat widget (Pro plan only) with keyword-based responses
- **Feature Gating** – Backend middleware + frontend UI state based on membership plan
- **Responsive Dark UI** – Dark theme with green accents, consistent across all pages

## Tech Stack

| Layer     | Technology                             |
|-----------|----------------------------------------|
| Backend   | Node.js, Express.js, MongoDB, Mongoose |
| Frontend  | React.js, Tailwind CSS, Recharts       |
| Auth      | JWT (jsonwebtoken + bcryptjs)          |
| HTTP      | Axios                                  |
| Container | Docker + Docker Compose                |

## Prerequisites

- Node.js >= 18
- npm >= 9
- MongoDB (local or Atlas) **or** Docker

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repo-url>
cd gym-tracker
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
```

### 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your values
```
dev
### 4. Run development servers

**Terminal 1 – Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 – Frontend:**
```bash
cd frontend
npm start
```

The backend runs on http://localhost:5000 and the frontend on http://localhost:3000.

## Running with Docker

Start MongoDB only (and run the apps locally):

```bash
docker-compose up -d
```

## Seed Script

Populate the database with sample users, plans, logs, and progress data:

```bash
cd backend
npm run seed
```

Default seeded users:
- `user@example.com` / `password123` (role: user)
- `admin@example.com` / `admin123` (role: admin)

## Create Admin User

```bash
cd backend
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=securepassword node scripts/createAdmin.js
```

Or pass args directly:

```bash
node scripts/createAdmin.js you@example.com securepassword "Your Name"
```

## API Routes

### Auth
| Method | Route             | Description        |
|--------|-------------------|--------------------|
| POST   | /api/auth/register | Register new user |
| POST   | /api/auth/login    | Login             |

### Users
| Method | Route              | Description             |
|--------|--------------------|-------------------------|
| GET    | /api/users/profile | Get current user profile |
| PUT    | /api/users/profile | Update profile           |
| PUT    | /api/users/goals   | Update fitness goals     |

### Workout Plans
| Method | Route                  | Description           |
|--------|------------------------|-----------------------|
| GET    | /api/workout-plans     | Get user's plans      |
| POST   | /api/workout-plans     | Create plan           |
| GET    | /api/workout-plans/:id | Get single plan       |
| PUT    | /api/workout-plans/:id | Update plan           |
| DELETE | /api/workout-plans/:id | Delete plan           |

### Workout Logs
| Method | Route                  | Description           |
|--------|------------------------|-----------------------|
| GET    | /api/workout-logs      | Get user's logs       |
| POST   | /api/workout-logs      | Create log            |
| GET    | /api/workout-logs/:id  | Get single log        |
| PUT    | /api/workout-logs/:id  | Update log            |
| DELETE | /api/workout-logs/:id  | Delete log            |

### Progress
| Method | Route               | Description             |
|--------|---------------------|-------------------------|
| GET    | /api/progress       | Get progress entries    |
| POST   | /api/progress       | Create entry            |
| GET    | /api/progress/:id   | Get single entry        |
| PUT    | /api/progress/:id   | Update entry            |
| DELETE | /api/progress/:id   | Delete entry            |

### Dashboard
| Method | Route                   | Description          |
|--------|-------------------------|----------------------|
| GET    | /api/dashboard/summary  | Dashboard summary    |

### Admin
| Method | Route            | Description       |
|--------|------------------|-------------------|
| GET    | /api/admin/users | List all users    |

### Membership
| Method | Route                       | Description                        |
|--------|-----------------------------|------------------------------------|
| GET    | /api/membership             | Get current user's membership plan |
| POST   | /api/membership/subscribe   | Subscribe to a plan (free/premium/pro) |
| POST   | /api/membership/cancel      | Cancel plan (reverts to free)      |

### Workouts (Public)
| Method | Route          | Description                       |
|--------|----------------|-----------------------------------|
| GET    | /api/workouts  | List 12 sample workout programs   |

## Membership Plans & Feature Gating

| Feature                        | Free | Premium | Pro |
|-------------------------------|:----:|:-------:|:---:|
| Basic workout tracking         | ✅   | ✅      | ✅  |
| Community access               | ✅   | ✅      | ✅  |
| Advanced analytics             | ❌   | ✅      | ✅  |
| Personalized workout plans     | ❌   | ✅      | ✅  |
| AI Gym Coach chat widget       | ❌   | ❌      | ✅  |
| 1-on-1 guidance                | ❌   | ❌      | ✅  |

### Testing Membership Gating

1. Register / login with any account
2. Go to **Membership** (sidebar → 👑 Membership)
3. Subscribe to **Pro** plan — the **AI Gym Coach** floating button (bottom-right) becomes interactive
4. Subscribe to **Free** plan — the AI Coach button shows a "Pro Required" tooltip
5. Subscribe to **Premium** — the Advanced Analytics banner appears on the Dashboard

**Or use the seeded test user** (`user@example.com` / `password123`) which already has the Premium plan.

To test Pro features:
1. Log in as `user@example.com` / `password123`
2. Go to Membership → click **Subscribe** on the Pro card
3. Navigate to Dashboard — the 🤖 AI Coach widget (bottom-right) is now active

### Backend feature gating

The `requirePlan` middleware can be applied to any route:

```js
const requirePlan = require('./src/middleware/requirePlan');

router.get('/premium-analytics', auth, requirePlan('premium'), handler);
router.get('/ai-coach',          auth, requirePlan('pro'),     handler);
```

