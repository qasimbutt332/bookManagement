'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { BookInput, createBook, getBookById, updateBook } from '@/services/api';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import Link from 'next/link';

interface BookFormProps {
  params: {
    action: string;
  };
}

export default function BookForm({ params }: BookFormProps) {
  const router = useRouter();
  const { action } = params;
  const isEdit = action !== 'new';
  const bookId = isEdit ? action : null;
  
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<BookInput>();
  
  useEffect(() => {
    if (isEdit && bookId) {
      fetchBook();
    }
  }, [isEdit, bookId]);
  
  const fetchBook = async () => {
    try {
      setLoading(true);
      const book = await getBookById(bookId!);
      reset({
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
  
  const onSubmit = async (data: BookInput) => {
    try {
      if (isEdit && bookId) {
        await updateBook(bookId, data);
      } else {
        await createBook(data);
      }
      router.push('/');
    } catch (err) {
      setError('Failed to save book. Please try again later.');
      console.error('Error saving book:', err);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <main className="container mx-auto px-4 py-8">
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
        
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {isEdit ? 'Edit Book' : 'Add New Book'}
        </h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              type="text"
              className={`shadow appearance-none border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              placeholder="Book Title"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && <p className="text-red-500 text-xs italic">{errors.title.message}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="author">
              Author
            </label>
            <input
              id="author"
              type="text"
              className={`shadow appearance-none border ${errors.author ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              placeholder="Author Name"
              {...register('author', { required: 'Author is required' })}
            />
            {errors.author && <p className="text-red-500 text-xs italic">{errors.author.message}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className={`shadow appearance-none border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              placeholder="Book Description"
              rows={4}
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && <p className="text-red-500 text-xs italic">{errors.description.message}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="publishedYear">
              Published Year
            </label>
            <input
              id="publishedYear"
              type="number"
              className={`shadow appearance-none border ${errors.publishedYear ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              placeholder="Published Year"
              {...register('publishedYear', { 
                required: 'Published Year is required',
                min: { value: 1000, message: 'Year must be after 1000' },
                max: { value: new Date().getFullYear(), message: 'Year cannot be in the future' }
              })}
            />
            {errors.publishedYear && <p className="text-red-500 text-xs italic">{errors.publishedYear.message}</p>}
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="isbn">
              ISBN
            </label>
            <input
              id="isbn"
              type="text"
              className={`shadow appearance-none border ${errors.isbn ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              placeholder="ISBN"
              {...register('isbn', { 
                required: 'ISBN is required',
                pattern: { 
                  value: /^(?:\d{10}|\d{13})$/,
                  message: 'ISBN must be 10 or 13 digits'
                }
              })}
            />
            {errors.isbn && <p className="text-red-500 text-xs italic">{errors.isbn.message}</p>}
          </div>
          
          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
            >
              <FaSave className="mr-2" />
              {isSubmitting ? 'Saving...' : (isEdit ? 'Update Book' : 'Add Book')}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
} 