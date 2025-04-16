'use client';

import { Suspense } from 'react';
import BookForm from '@/components/BookForm';
import { notFound } from 'next/navigation';

interface EditBookProps {
  params: {
    id: string;
  };
}

export default function EditBook({ params }: EditBookProps) {
  if (!params?.id) {
    notFound();
  }

  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    }>
      <div className="container mx-auto px-4 py-8">
        <BookForm bookId={params.id} />
      </div>
    </Suspense>
  );
} 