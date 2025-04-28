# Backend API

This is the Flask backend for the project. It provides the following endpoints:

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Add a new project
- `POST /api/contact` - Submit a contact message

## Setup

1. Install Python 3.8 or higher
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the server:
   ```bash
   python app.py
   ```

The server will run on `http://localhost:5000`
