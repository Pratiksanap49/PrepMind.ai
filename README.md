# PrepMind.ai

PrepMind.ai is an advanced, AI-powered interview preparation platform designed to help users confidently prepare for their technical and behavioral interviews. By leveraging the Groq API for rapid AI inference, PrepMind dynamically generates tailored interview questions and evaluates user answers in real time, providing comprehensive feedback to improve performance.

## 🌟 Features

- **User Authentication**: Secure signup and login functionality using JWT and bcrypt.
- **Dynamic Interview Setup**: Customize your interview by selecting topics, difficulty levels, and roles.
- **AI-Powered Question Generation**: Generates contextual, relevant interview questions utilizing Groq's high-speed LLM inference.
- **Interactive Interview Interface**: A clean, distraction-free environment to read questions and submit answers.
- **Real-Time Evaluation & Feedback**: Analyzes user responses to provide actionable feedback, scoring, and areas for improvement.
- **Dashboard & Session History**: Keep track of past interview sessions, review your performance over time, and revisit previous feedback.

## 🛠️ Tech Stack

### Frontend
- **React.js (19.x)**: Powerful UI library for building dynamic interfaces.
- **Vite**: Next-generation, high-performance frontend tooling.
- **Tailwind CSS & shadcn/ui**: For a highly customizable, accessible, and stunning visual design.
- **Framer Motion**: For smooth, interactive UI animations.
- **React Router Dom**: For seamless client-side routing.

### Backend
- **Node.js & Express.js**: Fast, scalable runtime and framework for the RESTful API.
- **MongoDB & Mongoose**: Flexible NoSQL database and elegant object modeling for persistent data storage.
- **Groq SDK**: Integration with hyper-fast LLMs for AI question generation and evaluation.
- **JWT (JSON Web Tokens)**: Secure stateless authentication mechanisms.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm installed on your machine.
- [Node.js](https://nodejs.org/en/download/)
- [MongoDB](https://www.mongodb.com/try/download/community) (If running locally, or have a MongoDB Atlas URI)

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd Prepmind.ai
   ```

2. **Setup the Backend (Server)**
   Navigate to the server directory, install dependencies, and setup your `.env` file.
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GROQ_API_KEY=your_groq_api_key
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Setup the Frontend (Client)**
   Open a new terminal window, navigate to the client directory, install dependencies, and start the development server.
   ```bash
   cd client
   npm install
   # Start the React client
   npm run dev
   ```

4. **Access the Application**
   Open your browser and navigate to `http://localhost:5173`. The backend API should be running on `http://localhost:5000`.

## 📂 Project Structure

```
Prepmind.ai/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── api/            # Axios API configurations
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React context for state management (e.g., Auth)
│   │   ├── pages/          # Main route components (Dashboard, Interview, etc.)
│   │   └── index.css       # Global styling & Tailwind directives
│   └── package.json
└── server/                 # Node.js backend application
    ├── controllers/        # Route controllers (auth, session)
    ├── middleware/         # Custom Middlewares (e.g., auth check)
    ├── models/             # Mongoose database schemas
    ├── routes/             # API route definitions
    ├── services/           # Business logic (e.g., Groq API interactions)
    └── index.js            # Entry point for the server
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page and fork the repository to propose changes.

## 📝 License

This project is licensed under the ISC License.
