'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Book, getAllBooks, deleteBook } from '@/services/api';
import { FaEdit, FaTrash, FaPlus, FaBook } from 'react-icons/fa';

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await getAllBooks();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch books. Please try again later.');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
        setBooks(books.filter(book => book._id !== id));
      } catch (err) {
        setError('Failed to delete book. Please try again later.');
        console.error('Error deleting book:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FaBook className="mr-2 text-blue-600" />
          Book Management
        </h1>
        <Link 
          href="/books/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FaPlus className="mr-2" />
          Add New Book
        </Link>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg mb-4">No books found. Add your first book!</p>
          <Link 
            href="/books/new" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
          >
            <FaPlus className="mr-2" />
            Add New Book
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{book.title}</h2>
                <p className="text-gray-600 mb-2">By <span className="font-medium">{book.author}</span></p>
                <p className="text-gray-500 text-sm mb-2">Published: {book.publishedYear}</p>
                <p className="text-gray-500 text-sm mb-4">ISBN: {book.isbn}</p>
                <p className="text-gray-700 mb-4 line-clamp-3">{book.description}</p>
                <div className="flex justify-end space-x-2">
                  <Link 
                    href={`/books/${book._id}`}
                    className="text-blue-600 hover:text-blue-800 p-2"
                    title="View Details"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </Link>
                  <Link 
                    href={`/books/${book._id}/edit`}
                    className="text-green-600 hover:text-green-800 p-2"
                    title="Edit Book"
                  >
                    <FaEdit className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="text-red-600 hover:text-red-800 p-2"
                    title="Delete Book"
                  >
                    <FaTrash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
} 