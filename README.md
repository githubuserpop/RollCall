# Roll Call - Modern Group Voting Application

Roll Call is a fully-featured, responsive group voting application built with React, Vite, and Flask. It transforms group voting into social media to help you stay connected with those you know.

![Roll Call Logo](public/rollcallimg.png)

## Features

- **User Authentication**: Secure email/password authentication
- **Poll Creation**: Create custom polls with multiple-choice questions
- **Group Management**: Organize friends into groups for targeted polling
- **Real-time Updates**: See poll results update in real-time
- **Data Visualization**: View poll results with interactive charts
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Clean UI**: Modern, minimalist interface with intuitive navigation

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Flask, SQLAlchemy, SQLite
- **Data Visualization**: Chart.js with react-chartjs-2
- **Icons**: React Icons
- **Forms**: React Hook Form

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Python 3.8 or higher
- npm or yarn
- pip

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rollcall.git
cd rollcall
```

2. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
flask db upgrade
python seed.py  # (Optional) Populate with sample data
flask run
```

3. Set up the frontend:
```bash
cd frontend
npm install
# or
yarn install
```

4. Start the frontend development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Application Structure

```
├── backend/                # Flask Backend
│   ├── app.py              # Main Flask application
│   ├── models.py           # SQLAlchemy database models
│   ├── extensions.py       # Flask extensions initialization
│   ├── validation.py       # Request validation functions
│   └── migrations/         # Database migrations
│
├── frontend/               # React Frontend
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   ├── context/        # React context providers
│   │   ├── pages/          # Page components
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   └── App.tsx         # Main application component
│   ├── index.html          # HTML entry point
│   └── vite.config.ts      # Vite configuration
│
└── public/                 # Static files
```

## Key Features

### Authentication
- User registration and login
- Profile management

### Groups
- Create and manage groups
- Add friends to groups
- Group-specific polls

### Polls
- Create polls with custom options
- Vote on polls
- View poll results
- Public and private polls

## Backend API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Users
- `PUT /api/users/profile` - Update user profile
- `GET /api/friends/search` - Search for users

### Groups
- `GET /api/groups` - Get all groups
- `POST /api/groups` - Create a new group
- `GET /api/groups/:id` - Get group details

### Polls
- `POST /api/polls` - Create a new poll
- `POST /api/polls/:id/vote` - Vote on a poll

## Database Structure

The application uses SQLite with SQLAlchemy ORM with the following models:
- User - User accounts and profiles
- Group - User groups
- Poll - Polls with options
- PollOption - Individual poll options
- Vote - User votes on polls

## Deployment

### Backend Deployment
1. Set up a virtual environment on your server
2. Install dependencies from requirements.txt
3. Configure environment variables
4. Use a production WSGI server like Gunicorn
5. Set up a reverse proxy with Nginx

### Frontend Deployment
1. Build the frontend for production:
```bash
npm run build
# or
yarn build
```
2. Deploy the contents of the `dist` directory to a static file server

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- UI design inspired by modern voting applications
- Icons from [React Icons](https://react-icons.github.io/react-icons/)
- Charts powered by [Chart.js](https://www.chartjs.org/) and [react-chartjs-2](https://react-chartjs-2.js.org/)
