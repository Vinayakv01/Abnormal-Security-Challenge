# Abnormal-Security-Challenge
This project is a full-stack application for secure file sharing. It features a React frontend and a Django backend, with SQLite3 as the database. The application includes encryption, role-based access control, and multi-factor authentication.


Features
Backend
User authentication and authorization (MFA, JWT-based).
Role-based access control (Admin, Regular User, Guest).
File upload, encryption (AES-256), and secure sharing.
Expiring shareable links with customizable permissions.
Frontend
User-friendly interface for file upload and sharing.
Secure file transfer and encryption capabilities.
Multi-factor authentication during login.
Technologies Used
Frontend:
React: A JavaScript library for building user interfaces.
Tailwind CSS: For styling.
Redux: For state management.
Backend:
Django: Web framework for the backend.
Django Rest Framework (DRF): API development.
SQLite3: Lightweight database for development.
Getting Started
Prerequisites
Ensure you have the following installed on your system:

Node.js (v16 or later)
Python (v3.9 or later)

npm (Node Package Manager) or yarn for frontend dependencies

pip (Python Package Manager) for backend dependencies

Setup Backend

Navigate to the backend directory:

cd secure-file-sharing-backend

Create and activate a virtual environment:

python -m venv env

source env/bin/activate  # On Windows: env\Scripts\activate

Install the required dependencies:

pip install -r requirements.txt

Apply database migrations:

python manage.py migrate

Start the development server:

python manage.py runserver

Access the backend API at http://127.0.0.1:8000.

Setup Frontend

Navigate to the frontend directory:

cd secure-file-sharing-frontend

Install the required dependencies:


npm install

Configure the API URL in the frontend:

Open src/config.js or the relevant file for your API configuration and set the REACT_APP_API_URL to the backend URL (e.g., http://127.0.0.1:8000).

Start the React development server:

npm start

Access the frontend at http://localhost:3000.

Usage
Guest User:View shared files.Limited permissions.

Regular User:Upload, download, and share files.Manage file permissions.

Admin:Manage users and files.Oversee platform operations.


Notes for Maintenance:
Ensure the API URLs in the frontend (REACT_APP_API_URL) and backend are aligned.
For production, consider replacing SQLite with a more robust database like PostgreSQL.
Use HTTPS for production to secure communication between the frontend and backend.
This structure will make it easy for collaborators or evaluators to set up and run your application!