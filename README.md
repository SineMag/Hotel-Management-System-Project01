# Hotel Management System

This project is a Hotel Management System with modules for SPA & Wellness and Gym & Fitness Center Management.

## Project Status

The project is currently under development.
-   **Backend:** The basic API structure is in place for both SPA and Gym modules. It uses a Node.js, Express, and MongoDB stack.
-   **Frontend:** The project is set up with React (using Vite) and TypeScript. Material UI and Tailwind CSS are being integrated.

## Prerequisites

-   [Node.js](https://nodejs.org/) (v18.x or later recommended)
-   [MongoDB](https://www.mongodb.com/try/download/community) (a running instance, either local or cloud-based)

## Setup and Installation

Follow these steps to get the project running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/SineMag/Hotel-Management-System-Project01.git
cd Hotel-Management-System-Project01
```

### 2. Backend Setup

The backend server connects to the MongoDB database.

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```

2.  **Install backend dependencies:**
    ```bash
    npm install
    ```

3.  **Create an environment file:**
    Create a file named `.env` in the `server` directory and add your MongoDB connection string:
    ```env
    MONGODB_URI=your_mongodb_connection_string_here
    ```

4.  **Run the backend server:**
    ```bash
    node index.js
    ```
    The API server should now be running on `http://localhost:5000`.

### 3. Frontend Setup

The frontend is a React application built with Vite.

1.  **Navigate to the project root directory** (if you are in the `server` directory, go back one level):
    ```bash
    cd ..
    ```

2.  **Install frontend dependencies:**
    ```bash
    npm install
    ```

3.  **Run the frontend development server:**
    ```bash
    npm run dev
    ```
    The application should now be accessible at `http://localhost:5173` (or another port if 5173 is busy).