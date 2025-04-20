# Planto - Full-Stack Nursery Website

A professional e-commerce platform for plants, gardening supplies, and gardening services.

## Features

- User authentication and authorization
- Product browsing and shopping cart
- Gardener booking system
- Admin panel for management
- Blog with gardening tips
- SEO optimized

## Tech Stack

- Frontend: React.js, Redux, Material-UI
- Backend: Node.js, Express.js
- Database: MySQL

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   cd client && npm install
   ```

2. Configure environment variables:
   - Create a .env file in the root directory
   - Add necessary environment variables (see .env.example)

3. Set up the database:
   - Create a MySQL database
   - Import the schema using phpMyAdmin

4. Start the development servers:
   ```bash
   # Run backend and frontend concurrently
   npm run dev:full
   ```

## Project Structure

```
planto/
├── client/               # React frontend
├── server/              # Node.js backend
│   ├── config/         # Database and other configurations
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Custom middleware
│   ├── models/        # Database models
│   └── routes/        # API routes
├── uploads/            # File uploads
└── package.json
```
