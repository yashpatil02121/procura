# Procura Assignment

A full-stack web application built with NestJS backend and React frontend, featuring user authentication, product management, and order processing.

## Architecture

- **Backend**: NestJS with TypeORM and PostgreSQL
- **Frontend**: React with Vite and Tailwind CSS
- **Authentication**: JWT-based authentication
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose

## Features

- User authentication (login/signup)
- Product management (CRUD operations)
- Order creation and management
- JWT-based secure API access
- Responsive UI with Tailwind CSS

## Docker Setup (Recommended)

### Prerequisites

- Docker
- Docker Compose

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd procura
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

   This will:
   - Start PostgreSQL database
   - Build and run the NestJS backend
   - Build and run the React frontend
   - Set up networking between services

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - API Documentation: http://localhost:3000/api (if Swagger is enabled)

### Docker Services

- **postgres**: PostgreSQL database on port 5432
- **backend**: NestJS API server on port 3000
- **frontend**: React application on port 5173

### Environment Variables

The Docker setup uses the following environment variables:

**Backend:**
- `DB_HOST=postgres`
- `DB_PORT=5432`
- `DB_USERNAME=postgres`
- `DB_PASSWORD=postgres`
- `DB_NAME=procura`
- `JWT_SECRET=supersecret`
- `PORT=3000`

### Stopping the Application

```bash
docker-compose down
```

To remove volumes (clears database data):
```bash
docker-compose down -v
```

## Local Development Setup

If you prefer to run the application locally without Docker:

### Prerequisites

- Node.js 18+
- PostgreSQL
- pnpm

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd procura-assignment-backend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file with:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=procura
   JWT_SECRET=your_secret_key
   PORT=3000
   ```

4. **Start the backend**
   ```bash
   # Development mode
   pnpm run start:dev
   
   # Production mode
   pnpm run start:prod
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd procura-assignment-frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the frontend**
   ```bash
   # Development mode
   pnpm run dev
   
   # Build for production
   pnpm run build
   pnpm run preview
   ```

### Database Setup

1. **Create PostgreSQL database**
   ```sql
   CREATE DATABASE procura;
   ```

2. **Run database migrations** (if any)
   The application uses TypeORM with `synchronize: true` for development, which automatically creates tables.

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (authenticated)

#Admin Credentials
admin@test.com
password123

#User Credentials
user@test.com
password123

### Products
- `GET /products` - List all products (authenticated)
- `POST /products` - Create new product (authenticated)
- `PATCH /products/:id` - Update product (authenticated)
- `DELETE /products/:id` - Delete product (authenticated)

### Orders
- `GET /orders` - List all orders (authenticated)
- `POST /orders` - Create new order (authenticated)

## Project Structure

```
procura/
├── procura-assignment-backend/     # NestJS Backend
│   ├── src/
│   │   ├── auth/                  # Authentication module
│   │   ├── products/              # Products module
│   │   ├── orders/                # Orders module
│   │   ├── profiles/              # User profiles
│   │   └── main.ts               # Application entry point
│   └── Dockerfile
├── procura-assignment-frontend/    # React Frontend
│   ├── src/
│   │   ├── pages/                # Page components
│   │   ├── App.jsx               # Main app component
│   │   └── main.jsx              # Application entry point
│   └── Dockerfile
└── docker-compose.yml            # Docker Compose configuration
```

## Technologies Used

### Backend
- NestJS - Node.js framework
- TypeORM - ORM for database operations
- PostgreSQL - Database
- JWT - Authentication
- bcryptjs - Password hashing
- Passport - Authentication middleware

### Frontend
- React - UI library
- Vite - Build tool
- Tailwind CSS - Styling
- Axios - HTTP client
- React Router DOM - Routing

## Development Commands

### Backend
```bash
# Install dependencies
pnpm install

# Start development server
pnpm run start:dev

# Build for production
pnpm run build

# Run tests
pnpm run test

# Run e2e tests
pnpm run test:e2e
```

### Frontend
```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Run linter
pnpm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

This project is licensed under the MIT License.
