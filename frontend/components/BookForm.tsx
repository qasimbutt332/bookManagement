'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBook, getBookById, updateBook } from '@/services/api';
import { CreateBookDto } from '@/services/api';
import Link from 'next/link';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

interface BookFormProps {
  bookId?: string;
}

export default function BookForm({ bookId }: BookFormProps) {
  const router = useRouter();
  const isEditing = Boolean(bookId);

  const [formData, setFormData] = useState<CreateBookDto>({
    title: '',
    author: '',
    description: '',
    publishedYear: new Date().getFullYear(),
    isbn: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && bookId) {
      fetchBook();
    }
  }, [bookId, isEditing]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const book = await getBookById(bookId!);
      setFormData({
        title: book.title,
        author: book.author,
        description: book.description,
        publishedYear: book.publishedYear,
        isbn: book.isbn
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch book details. Please try again later.');
      console.error('Error fetching book:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing && bookId) {
        await updateBook(bookId, formData);
      } else {
        await createBook(formData);
      }
      router.push('/');
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} book. Please try again later.`);
      console.error('Error saving book:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'publishedYear' ? parseInt(value) || new Date().getFullYear() : value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Back to Books
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Book' : 'Add New Book'}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            required
            value={formData.author}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="publishedYear" className="block text-sm font-medium text-gray-700">
            Published Year
          </label>
          <input
            type="number"
            id="publishedYear"
            name="publishedYear"
            required
            min="1000"
            max={new Date().getFullYear()}
            value={formData.publishedYear}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">
            ISBN
          </label>
          <input
            type="text"
            id="isbn"
            name="isbn"
            required
            pattern="\d{10}|\d{13}"
            title="Please enter a valid ISBN (10 or 13 digits)"
            value={formData.isbn}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            href="/"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
          >
            <FaSave className="mr-2" />
            {loading ? 'Saving...' : (isEditing ? 'Update Book' : 'Add Book')}
          </button>
        </div>
      </form>
    </div>
  );
} 