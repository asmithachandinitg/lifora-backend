# lifora-backend

Backend REST API for the Lifora personal life management app. Built with Node.js, Express, and MongoDB.

Frontend: [github.com/asmithachandinitg/lifora](https://github.com/asmithachandinitg/lifora)

---

## What this does

This is the server that powers Lifora. It handles user auth and stores data for all the tracking modules. Everything is a REST API that the Angular frontend talks to.

---

## Stack

- **Node.js + Express** — server and routing
- **MongoDB + Mongoose** — database
- **JWT (jsonwebtoken)** — authentication
- **bcryptjs** — password hashing
- **Nodemailer** — email
- **dotenv** — environment variables
- **nodemon** — auto-restart in development

---

## Getting started

You'll need Node.js and MongoDB installed.

```bash
git clone https://github.com/asmithachandinitg/lifora-backend.git
cd lifora-backend
npm install
```

Create a `.env` file in the root:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/lifora
```

Start dev server:

```bash
npm run dev
```

Or without nodemon:

```bash
npm start
```

Server runs on `http://localhost:5000`.

---

## Project structure

```
lifora-backend/
├── server.js                  # entry point
├── app.js                     # Express app setup
├── .env
├── package.json
└── src/
    ├── config/
    │   └── db.js              # MongoDB connection
    ├── middleware/
    │   └── auth.middleware.js # JWT verification
    ├── modules/
    │   ├── auth/
    │   │   ├── auth.controller.js
    │   │   └── auth.routes.js
    │   ├── diary/
    │   ├── expenses/
    │   ├── fitness/
    │   ├── food/
    │   ├── goals/
    │   ├── habits/
    │   ├── medicine/
    │   ├── mood/
    │   ├── period/
    │   ├── pregnancy/
    │   ├── reading/
    │   ├── sleep/
    │   ├── tasks/
    │   └── travel/
    ├── users/
    │   ├── user.controller.js
    │   ├── user.model.js
    │   └── user.routes.js
    └── utils/
```

Each module folder contains a controller, model, and routes file.

---

## API routes

All routes are prefixed with `/api`. Protected routes require:

```
Authorization: Bearer <token>
```

### Auth — `/api/auth`

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login, returns a JWT |

### Users — `/api/users`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/users/me` | ✓ | Get current user profile |
| PUT | `/api/users/me` | ✓ | Update profile |

### Fitness — `/api/fitness`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/fitness` | ✓ | Get all fitness logs |
| POST | `/api/fitness` | ✓ | Add a log |
| PUT | `/api/fitness/:id` | ✓ | Update a log |
| DELETE | `/api/fitness/:id` | ✓ | Delete a log |

### Food — `/api/food`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/food` | ✓ | Get all food logs |
| POST | `/api/food` | ✓ | Log a meal |
| PUT | `/api/food/:id` | ✓ | Update a log |
| DELETE | `/api/food/:id` | ✓ | Delete a log |

### Habits — `/api/habits`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/habits` | ✓ | Get all habits |
| POST | `/api/habits` | ✓ | Create a habit |
| PUT | `/api/habits/:id` | ✓ | Update a habit |
| DELETE | `/api/habits/:id` | ✓ | Delete a habit |

### Medicine — `/api/medicine`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/medicine` | ✓ | Get medication logs |
| POST | `/api/medicine` | ✓ | Add a log |
| PUT | `/api/medicine/:id` | ✓ | Update a log |
| DELETE | `/api/medicine/:id` | ✓ | Delete a log |

### Period — `/api/period`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/period` | ✓ | Get cycle logs |
| POST | `/api/period` | ✓ | Add an entry |
| PUT | `/api/period/:id` | ✓ | Update an entry |
| DELETE | `/api/period/:id` | ✓ | Delete an entry |

### Travel — `/api/travel`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/travel` | ✓ | Get travel logs |
| POST | `/api/travel` | ✓ | Add a travel entry |
| PUT | `/api/travel/:id` | ✓ | Update an entry |
| DELETE | `/api/travel/:id` | ✓ | Delete an entry |

### Diary — `/api/diary`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/diary` | ✓ | Get all diary entries |
| POST | `/api/diary` | ✓ | Create an entry |
| PUT | `/api/diary/:id` | ✓ | Update an entry |
| DELETE | `/api/diary/:id` | ✓ | Delete an entry |

### Expenses — `/api/expenses`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/expenses` | ✓ | Get all expenses |
| POST | `/api/expenses` | ✓ | Add an expense |
| PUT | `/api/expenses/:id` | ✓ | Update an expense |
| DELETE | `/api/expenses/:id` | ✓ | Delete an expense |

### Goals — `/api/goals`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/goals` | ✓ | Get all goals |
| POST | `/api/goals` | ✓ | Add a goal |
| PUT | `/api/goals/:id` | ✓ | Update a goal |
| DELETE | `/api/goals/:id` | ✓ | Delete a goal |

### Mood — `/api/mood`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/mood` | ✓ | Get mood logs |
| POST | `/api/mood` | ✓ | Log a mood entry |
| PUT | `/api/mood/:id` | ✓ | Update a log |
| DELETE | `/api/mood/:id` | ✓ | Delete a log |

### Pregnancy — `/api/pregnancy`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/pregnancy` | ✓ | Get pregnancy logs |
| POST | `/api/pregnancy` | ✓ | Add an entry |
| PUT | `/api/pregnancy/:id` | ✓ | Update an entry |
| DELETE | `/api/pregnancy/:id` | ✓ | Delete an entry |

### Reading — `/api/reading`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/reading` | ✓ | Get reading logs |
| POST | `/api/reading` | ✓ | Add a book/entry |
| PUT | `/api/reading/:id` | ✓ | Update an entry |
| DELETE | `/api/reading/:id` | ✓ | Delete an entry |

### Sleep — `/api/sleep`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/sleep` | ✓ | Get sleep logs |
| POST | `/api/sleep` | ✓ | Log a sleep entry |
| PUT | `/api/sleep/:id` | ✓ | Update a log |
| DELETE | `/api/sleep/:id` | ✓ | Delete a log |

### Tasks — `/api/tasks`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/tasks` | ✓ | Get all tasks |
| POST | `/api/tasks` | ✓ | Create a task |
| PUT | `/api/tasks/:id` | ✓ | Update a task |
| DELETE | `/api/tasks/:id` | ✓ | Delete a task |

---

## How auth works

1. User registers or logs in via `/api/auth`
2. Server returns a signed JWT
3. Client sends it as `Authorization: Bearer <token>` on protected requests
4. `auth.middleware.js` verifies the token and attaches the user to `req.user`
5. Passwords are hashed with bcryptjs — never stored as plain text

---

## Notes

- Still in active development
- Nodemailer is set up — configure your SMTP credentials in `.env` to use it
- Swap `MONGO_URI` in `.env` for MongoDB Atlas if you want a cloud DB

---

## Author

Asmitha Chandini T G
