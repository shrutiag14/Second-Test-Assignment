# Quick Start Guide

## Running the Application

### Option 1: Using Docker Compose (Easiest)

1. Open PowerShell and navigate to the project directory:
   ```powershell
   cd c:\Users\shrutagarwal\Desktop\test-2
   ```

2. Build and start all services:
   ```powershell
   docker-compose up --build
   ```

3. Open your browser and go to: **http://localhost:3000**

4. To stop the application:
   ```powershell
   docker-compose down
   ```

### Option 2: Running Locally (For Development)

**Terminal 1 - Start the Server:**
```powershell
cd c:\Users\shrutagarwal\Desktop\test-2\server
npm install
npm run dev
```

**Terminal 2 - Start the Client:**
```powershell
cd c:\Users\shrutagarwal\Desktop\test-2\client
npm install
npm run dev
```

Then open: **http://localhost:3000**

## Using the Application

1. **Register**: Create a new account with username and password
2. **Create Starting Number**: Enter any number to start a calculation tree
3. **Add Operations**: Click "+ Add Operation" on any calculation to respond with +, -, *, or /
4. **View Tree**: See all calculations in a hierarchical tree structure
5. **Logout**: Click logout to return to the login screen

## Running Tests

### Server Tests with Coverage:
```powershell
cd c:\Users\shrutagarwal\Desktop\test-2\server
npm install
npm run test:coverage
```

### Client Tests with Coverage:
```powershell
cd c:\Users\shrutagarwal\Desktop\test-2\client
npm install
npm run test:coverage
```

## Project Highlights

✅ Full TypeScript implementation (Client & Server)
✅ Component-based React architecture
✅ JWT authentication with secure password hashing
✅ RESTful API with validation
✅ SQLite database with relational schema
✅ Docker Compose for easy deployment
✅ Jest tests with coverage reports
✅ Responsive UI with clean design

## Technical Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite3
- **Auth**: JWT + bcryptjs
- **Testing**: Jest + Supertest + React Testing Library
- **DevOps**: Docker + Docker Compose + Nginx
