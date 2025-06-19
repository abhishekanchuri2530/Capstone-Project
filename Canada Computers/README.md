# Canada Computers Project

A full-stack e-commerce application for Canada Computers built with Next.js, Tailwind CSS, and GraphQL.

## Project Structure

```
.
├── frontend/           # Next.js frontend application
└── backend/           # Node.js GraphQL backend
```

## Prerequisites

- Node.js (v18 or later)
- npm (v8 or later)

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```
   PORT=4000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The GraphQL server will be running at http://localhost:4000/graphql

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend application will be running at http://localhost:3000

## Features

- Modern, responsive UI built with Tailwind CSS
- GraphQL API backend
- TypeScript support
- Hot reloading for development
- Production-ready build configuration

## Development

- Frontend: The Next.js application uses the App Router and is built with TypeScript and Tailwind CSS
- Backend: Node.js server with Express and Apollo Server for GraphQL

## Production Build

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm start
``` 