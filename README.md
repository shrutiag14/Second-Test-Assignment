# Calculation Tree - Number-Based Discussion Platform

A unique social platform where users communicate through numbers and mathematical operations. Users can start discussions with a starting number, and others can respond by adding operations (addition, subtraction, multiplication, division) that build upon previous results, creating tree-like conversation threads.

## Features

### Business Scenarios Implemented

1. ✅ **Unregistered users** can view the tree of all user posts
2. ✅ **Unregistered users** can create an account with username and password
3. ✅ **Unregistered users** can authenticate and become registered users
4. ✅ **Registered users** can start a chain of calculations by publishing a starting number
5. ✅ **Registered users** can add operations on selected starting numbers
6. ✅ **Registered users** can respond to any calculation by publishing new ones

### Technical Features

- **Authentication**: JWT-based authentication with secure password hashing
- **Real-time Updates**: View calculation trees updated by all users
- **Tree Structure**: Hierarchical display of calculations showing parent-child relationships
- **Component-Based UI**: Modular React components for maintainability
- **Type Safety**: Full TypeScript implementation on both frontend and backend
- **Testing**: Jest tests with coverage for both server and client
- **Docker Support**: Complete containerization with Docker Compose

## Technology Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: React, TypeScript, Vite
- **Database**: SQLite
- **Authentication**: JWT (JSON Web Tokens), bcryptjs
- **Testing**: Jest, Supertest, React Testing Library
- **Containerization**: Docker, Docker Compose

## Project Structure

```
test-2/
├── server/                 # Backend application
│   ├── src/
│   │   ├── index.ts       # Server entry point
│   │   ├── database.ts    # Database initialization
│   │   ├── middleware/    # Auth & error handling
│   │   └── routes/        # API routes (auth, calculations)
│   ├── data/              # SQLite database storage
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── client/                # Frontend application
│   ├── src/
│   │   ├── App.tsx        # Main app component
│   │   ├── api.ts         # API client
│   │   ├── components/    # React components
│   │   └── styles.css     # Global styles
│   ├── Dockerfile
│   ├── nginx.conf         # Nginx configuration
│   ├── package.json
│   └── vite.config.ts
└── docker-compose.yml     # Docker orchestration
```

## Getting Started

### Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose
- Git

### Running with Docker Compose (Recommended)

1. **Clone or navigate to the project directory**:
   ```bash
   cd c:\Users\shrutagarwal\Desktop\test-2
   ```

2. **Start the application**:
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

4. **Stop the application**:
   ```bash
   docker-compose down
   ```

### Running Locally for Development

#### Server Setup

```bash
cd server
npm install
npm run dev
```

The server will start on http://localhost:4000, https://second-test-assignment-5s61.onrender.com

#### Client Setup

```bash
cd client
npm install
npm run dev
```

The client will start on http://localhost:3000

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user.

**Request Body**:
```json
{
  "username": "user123",
  "password": "password123"
}
```

**Response**:
```json
{
  "token": "jwt-token",
  "user": {
    "id": 1,
    "username": "user123"
  }
}
```

#### POST /api/auth/login
Login with existing credentials.

**Request Body**:
```json
{
  "username": "user123",
  "password": "password123"
}
```

### Calculation Endpoints

#### GET /api/calculations/tree
Get all calculations (no authentication required).

**Response**:
```json
[
  {
    "id": 1,
    "user_id": 1,
    "username": "user123",
    "parent_id": null,
    "is_starting_number": true,
    "operation": null,
    "operand": null,
    "result": 42,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### POST /api/calculations/start
Create a starting number (authentication required).

**Headers**:
```
Authorization: Bearer <jwt-token>
```

**Request Body**:
```json
{
  "number": 42
}
```

#### POST /api/calculations/operation
Add an operation to an existing calculation (authentication required).

**Headers**:
```
Authorization: Bearer <jwt-token>
```

**Request Body**:
```json
{
  "parentId": 1,
  "operation": "+",
  "operand": 10
}
```

**Operations**: `+`, `-`, `*`, `/`

## Testing

### Run Server Tests

```bash
cd server
npm test
```

### Run Client Tests

```bash
cd client
npm test
```

### Run Tests with Coverage

```bash
# Server
cd server
npm run test:coverage

# Client
cd client
npm run test:coverage
```

## How It Works

### The Concept

Unlike traditional social media where people communicate with text, this platform uses numbers and mathematical operations:

1. **Starting Number**: A user creates a "post" by choosing any number (e.g., 100)
2. **Operations**: Other users "comment" by choosing an operation (+, -, *, /) and a number
3. **Calculation Chain**: Each operation applies to the previous result, creating a tree of calculations

### Example

```
User A starts with: 100
├── User B adds: + 50 = 150
│   ├── User C adds: * 2 = 300
│   └── User D adds: / 3 = 50
└── User E adds: - 25 = 75
    └── User F adds: + 5 = 80
```

## Architecture Decisions

### Backend

- **Express**: Lightweight and flexible web framework
- **SQLite**: Simple file-based database, perfect for this use case
- **JWT**: Stateless authentication, scalable
- **TypeScript**: Type safety and better developer experience

### Frontend

- **React**: Component-based architecture for reusable UI elements
- **Vite**: Fast development server and build tool
- **Component Structure**: Separate components for Auth, Tree, Node, Form
- **Local Storage**: JWT token persistence for user sessions

### Database Schema

**users table**:
- id (PRIMARY KEY)
- username (UNIQUE)
- password (hashed)
- created_at

**calculations table**:
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- parent_id (FOREIGN KEY, nullable)
- is_starting_number (BOOLEAN)
- operation (+, -, *, /)
- operand (number)
- result (calculated)
- created_at

## Environment Variables

### Server

- `PORT`: Server port (default: 4000)
- `JWT_SECRET`: Secret key for JWT signing (change in production!)
- `NODE_ENV`: Environment (development/production)

### Client

- Built-time configuration through Vite

## Security Considerations

- Passwords are hashed using bcryptjs
- JWT tokens expire after 7 days
- SQL injection prevention through parameterized queries
- Input validation using express-validator
- CORS enabled for development

## Future Enhancements

- User profiles and avatars
- Real-time updates with WebSockets
- Calculation history and statistics
- Complex operations (square root, power, etc.)
- Social features (likes, favorites)
- Search and filter capabilities
- Mobile app version

## License

MIT

## Author

Created as a technical assignment demonstrating full-stack development skills with modern technologies.
