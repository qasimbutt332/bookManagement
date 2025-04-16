'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaSearch, FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import { getAllBooks, deleteBook } from '@/services/api';
import { Book } from '@/services/api';

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
        await fetchBooks(); // Refresh the list after deletion
      } catch (err) {
        setError('Failed to delete book. Please try again later.');
        console.error('Error deleting book:', err);
      }
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search books..."
            className="w-full sm:w-80 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <Link
          href="/books/new"
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <FaPlus /> Add New Book
        </Link>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg mb-4">
            {searchTerm ? 'No books found matching your search.' : 'No books found. Add your first book!'}
          </p>
          <Link 
            href="/books/new"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
          >
            <FaPlus className="mr-2" />
            Add New Book
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div key={book._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{book.title}</h3>
                <p className="text-gray-600 mb-2">By {book.author}</p>
                <p className="text-sm text-gray-500 mb-4">ISBN: {book.isbn}</p>
                <div className="flex justify-end space-x-2">
                  <Link
                    href={`/books/${book._id}`}
                    className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <FaEye />
                  </Link>
                  <Link
                    href={`/books/${book._id}/edit`}
                    className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded-full transition-colors"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 