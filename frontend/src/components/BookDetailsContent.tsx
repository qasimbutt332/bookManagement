'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Book, getBookById, deleteBook } from '@/services/api';
import { FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';

interface BookDetailsContentProps {
  id: string;
}

export default function BookDetailsContent({ id }: BookDetailsContentProps) {
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchBook();
    }
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const data = await getBookById(id);
      setBook(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch book details. Please try again later.');
      console.error('Error fetching book:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
        router.push('/');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete book. Please try again later.');
        console.error('Error deleting book:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
            <strong className="font-medium">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
          <div className="mt-4">
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Books
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Book Not Found</h1>
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Books
          </Link>
        </div>
        
        <div className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-gray-800">{book.title}</h1>
              <div className="flex space-x-2">
                <Link 
                  href={`/books/${id}/edit`}
                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <FaEdit className="mr-2" />
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <FaTrash className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Author</h2>
                <p className="text-gray-600">{book.author}</p>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Published Year</h2>
                <p className="text-gray-600">{book.publishedYear}</p>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">ISBN</h2>
                <p className="text-gray-600">{book.isbn}</p>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Created At</h2>
                <p className="text-gray-600">{new Date(book.createdAt).toLocaleString()}</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
              <p className="text-gray-600 whitespace-pre-line">{book.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 