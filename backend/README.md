# ExpressJS Kanban Backend

Project Overview
- RESTful API for Kanban board management
- Built with Node.js and Express framework
- Database management using Sequelize ORM
- User authentication with JWT and bcrypt

Prerequisites
- Node.js version 18 or higher
- MySQL database server
- NPM or Yarn package manager

Installation Steps
- Clone the repository to local machine
- Navigate to the project backend directory
- Run npm install to install dependencies

Environment Configuration
- Copy .env.example to a new file named .env
- Update DB_HOST with database host address
- Update DB_NAME with target database name
- Update DB_USER and DB_PASSWORD with database credentials
- Set JWT_SECRET with a secure random string

Database Setup
- Create the database in MySQL matching DB_NAME
- Run npm run migrate to execute SQL migrations
- Ensure tables for users, boards, lists, and cards are created

Available Scripts
- npm run dev: Start the server with nodemon for development
- npm start: Start the server in production mode
- npm run migrate: Run database migration scripts
- npm run lint: Check code style with ESLint

Project Structure
- src/app.mjs: Application entry point and configuration
- src/controllers: Logic for handling API requests
- src/models: Sequelize database model definitions
- src/routes: API endpoint definitions
- src/middleware: Custom middleware for auth and error handling
- src/migrations: SQL files for database schema
- src/validations: Request body validation logic

Core Features
- Authentication: Register and login for users
- Board Management: Create, read, update, and delete boards
- List Management: Organise cards within boards
- Card Management: Create and manage tasks on boards
