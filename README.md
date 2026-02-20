# 🌸 Lifora Backend – REST API

This is the backend API for **Lifora – Personal Life Management App**.

It provides RESTful APIs to manage different life modules including diary, tasks, habits, expenses, health tracking, and more.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS
- dotenv

---

## 📂 Project Structure

```
lifora-backend/
│
├── models/
├── routes/
├── controllers/
├── config/
├── index.js / server.js
├── package.json
└── README.md
```

---

## ⚙️ Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/asmithachandinitg/lifora-backend.git
cd lifora-backend
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Create Environment File

Create a `.env` file in the root folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

⚠️ Do not commit `.env` to GitHub.

---

### 4️⃣ Start Server

```bash
npm start
```

Or if using nodemon:

```bash
npm run dev
```

Server runs at:

```
http://localhost:5000
```

---

## 📡 API Endpoints

### 📝 Diary

- `GET /api/diary`
- `POST /api/diary`
- `PUT /api/diary/:id`
- `DELETE /api/diary/:id`

---

### ✅ Tasks

- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

---

### 💰 Expenses

- `GET /api/expenses`
- `POST /api/expenses`
- `PUT /api/expenses/:id`
- `DELETE /api/expenses/:id`

---

*(Add more modules as you build them)*

---

## 🔐 CORS Configuration

Make sure CORS is enabled:

```js
app.use(cors());
```

For production, restrict origin to frontend URL.

---

## 🗄 Database

Uses MongoDB with Mongoose schemas for:

- Diary entries
- Tasks
- Expenses
- Habits
- Health modules
- etc.

---

## 🔮 Future Improvements

- Authentication (JWT)
- Role-based access
- Validation middleware
- Centralized error handling
- Logging
- Rate limiting
- Production deployment configuration

---

## 👩‍💻 Author

Asmitha Chandini T G  

---

## 📌 Purpose

This backend powers the Lifora personal life management system and is built as a scalable modular REST API.
