# 📝 miniBlog

Welcome to **miniBlog** — a full-stack blogging platform where users can create, search, and view posts, comment on content, and manage their profiles.

The application features a **React + Tailwind CSS frontend** and a **Node.js + Express + MongoDB backend**, with JWT-based authentication and a rich text editor for creating blog posts. 🚀

## ✨ Features

* 🔐 User Authentication (Sign up, Log in)
* 🖊️ Create posts with a rich text editor
* 🔍 Search posts by keywords or categories
* 📄 View posts and detailed content
* ✏️ Update and delete your own posts
* 👤 User profiles and user-created posts
* 💬 Comment on posts
* 📱 Responsive UI
* 🔔 Toast notifications
* 🔒 Protected routes and authenticated API requests

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router
* Axios
* React Hot Toast
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT (JSON Web Tokens)

### Deployment

* Frontend: Render
* Backend: Render
* Database: MongoDB Atlas

```

## 💻 Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/miniblog.git
cd miniblog
```

### 2. Setup the Backend

Navigate to the backend:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Start the backend:

```bash
node server.js
```

### 3. Setup the Frontend

Open a new terminal and navigate to the frontend:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder if required:

```env
VITE_API_URL=your_backend_api_url
```

Start the React development server:

```bash
npm run dev
```

Vite will provide a local development URL in the terminal.

## 🔐 Environment Variables

### Backend

| Variable     | Description                            |
| ------------ | -------------------------------------- |
| `MONGO_URI`  | MongoDB connection string              |
| `JWT_SECRET` | Secret key used for JWT authentication |
| `PORT`       | Port used by the backend server        |

### Frontend

| Variable       | Description                 |
| -------------- | --------------------------- |
| `VITE_API_URL` | Base URL of the backend API |

> ⚠️ Never commit `.env` files or secret credentials to GitHub.

## 🚀 Usage

* Sign up or log in to your account
* Create and format blog posts using the rich text editor
* Search and browse existing posts
* View detailed blog content
* Manage your own posts from your profile
* Update or delete your posts
* Comment on posts and interact with other users

## 🌐 Live Demo

**LIVE:** https://miniblog-okfa.onrender.com/

## 📌 Future Improvements

* ❤️ Like and bookmark posts
* 🔔 Real-time notifications
* 🖼️ Image uploads for blog posts
* 📊 User dashboard and analytics
* 🔎 Advanced filtering and sorting
* 🌙 Dark mode

## 👨‍💻 Author

**Abhishek Kumar**

Built as a full-stack project to practice and demonstrate modern web development using the MERN stack.
