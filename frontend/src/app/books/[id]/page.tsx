'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Book, getBookById, deleteBook } from '@/services/api';
import { FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';

interface BookDetailsProps {
  params: {
    id: string;
  };
}

export default function BookDetails({ params }: BookDetailsProps) {
  const router = useRouter();
  const { id } = params;
  
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchBook();
  }, [id]);
  
  const fetchBook = async () => {
    try {
      setLoading(true);
      const data = await getBookById(id);
      setBook(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch book details. Please try again later.');
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
  
  if (!book) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Book Not Found</h1>
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 flex items-center justify-center"
          >
            <FaArrowLeft className="mr-2" />
            Back to Books
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <FaArrowLeft className="mr-2" />
            Back to Books
          </Link>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-gray-800">{book.title}</h1>
              <div className="flex space-x-2">
                <Link 
                  href={`/books/${book.id}/edit`}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
                >
                  <FaEdit className="mr-2" />
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
                >
                  <FaTrash className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
              <p className="text-gray-600 whitespace-pre-line">{book.description}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 