# AccessMap

A community-driven accessibility mapping platform that helps people with disabilities navigate urban environments by crowdsourcing accessibility information.

## Features

- **Interactive Map**: Real-time accessibility information with location-based incident reporting
- **Community Voting**: Democratic approval system for reported accessibility issues
- **User Authentication**: Secure login and registration system
- **Mobile-First Design**: Responsive interface optimized for all devices
- **Real-Time Updates**: Live notifications for new incidents and approvals

## Tech Stack

### Frontend
- React 19
- React Router for navigation
- Leaflet for interactive maps
- Axios for API communication
- React Icons for UI elements
- CSS Modules for styling

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Socket.IO for real-time updates
- Multer for file uploads

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- MapTiler API key
- OpenCage API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd access-map0
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

4. Set up environment variables:
Create a `.env` file in the backend directory with:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5001
```

5. Start the development servers:

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm start
```

## Project Structure

```
access-map0/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── forms/       # Login and signup forms
│   │   │   ├── Incident/    # Incident-related components
│   │   │   ├── pages/       # Page components
│   │   │   └── Styles/      # CSS modules
│   │   └── App.js          # Main app component
├── backend/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── server.js          # Express server
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Incidents
- `GET /api/incidents` - Get all incidents
- `POST /api/incident/report` - Report new incident (authenticated)
- `POST /api/incident/:id/vote` - Vote on incident (authenticated)
- `DELETE /api/incident/:id` - Remove incident (authenticated, owner only)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Team

- Ankit D. Vishwakarma
- Amisth Mahendrakar

*Shree L.R. Tiwari Degree College*