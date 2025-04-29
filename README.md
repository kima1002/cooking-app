# Cooking Support System

A full-stack web application for managing cooking recipes, built with NestJS and Angular.

## Technology Stack

- **Backend**: NestJS (TypeScript), MongoDB (with Mongoose)
- **Frontend**: Angular (TypeScript), Angular Material UI
- **Database**: MongoDB

## Features

- Recipe management (CRUD operations)
- Responsive UI with Angular Material
- Form validation
- Error handling and user notifications

## Project Structure

```
cooking-app/
├── backend/              # NestJS backend
│   ├── src/
│   │   ├── recipes/      # Recipe module
│   │   ├── app.module.ts # Main app module
│   │   └── main.ts       # Entry point
│   ├── .env.example      # Environment variables example
│   └── package.json      # Backend dependencies
└── frontend/             # Angular frontend
    ├── src/
    │   ├── app/
    │   │   ├── recipes/  # Recipe components and services
    │   │   └── ...       # Other Angular files
    │   └── environments/ # Environment configuration
    └── package.json      # Frontend dependencies
```

## Running with Docker

The application can be run using Docker Compose, which will start all required services (MongoDB, backend, and frontend) in containers.

### Prerequisites for Docker

- Docker and Docker Compose installed on your machine

### Steps to run with Docker

1. Navigate to the project root directory
2. Run the following command:

```bash
docker-compose up -d
```

This will:
- Start MongoDB on port 27017
- Build and start the backend on port 3000
- Build and start the frontend on port 4200

### Accessing the application

- Frontend: http://localhost:4200
- Backend API: http://localhost:3000/api

### Stopping the Docker containers

To stop all containers:

```bash
docker-compose down
```

To stop and remove all containers, networks, and volumes:

```bash
docker-compose down -v
```

## Local Development Setup

### Prerequisites

- Node.js (v16+)
- MongoDB

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd cooking-app/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` file and configure your MongoDB connection.

4. Start the backend server:
   ```
   npm run start:dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd cooking-app/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the Angular development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:4200`

## API Endpoints

- `POST /api/recipes`: Create a recipe
- `GET /api/recipes`: Get all recipes
- `GET /api/recipes/:id`: Get single recipe
- `PATCH /api/recipes/:id`: Update a recipe
- `DELETE /api/recipes/:id`: Delete a recipe

## Seeding the Database

To seed the database with initial recipe data:

```bash
cd backend
npm run seed
```

## License

This project is licensed under the MIT License.
