# Book Management System

A full-stack web application for managing books, built with Next.js, Node.js, Express, and MongoDB.

## Project Structure

```
book-management/
├── frontend/          # Next.js frontend application
└── backend/          # Express.js backend API
```

## Features

- Create, read, update, and delete books
- Search books by title or author
- Responsive design
- Form validation
- Error handling

## Tech Stack

### Frontend
- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd book-management
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Set up backend environment variables:
Create a `.env` file in the backend directory with:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

4. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

5. Start the development servers:

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:5000`.

## API Endpoints

- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get a specific book
- `POST /api/books` - Create a new book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Book Schema

- `title` (String, required)
- `author` (String, required)
- `description` (String, required)
- `publishedYear` (Number, required)
- `isbn` (String, required, unique)

## Technologies Used

- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - express-validator

- Frontend:
  - Next.js
  - React
  - TypeScript
  - Tailwind CSS
  - React Hook Form
  - Axios 