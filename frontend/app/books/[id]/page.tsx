'use client';

import { Suspense } from 'react';
import BookDetailsContent from '@/components/BookDetailsContent';

interface BookDetailsProps {
  params: {
    id: string;
  };
}

export default function BookDetails({ params }: BookDetailsProps) {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    }>
      <BookDetailsContent id={params.id} />
    </Suspense>
  );
} 