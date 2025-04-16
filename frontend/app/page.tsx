'use client';

import { getAllBooks } from '@/services/api';
import BookList from '@/components/BookList';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <BookList />
    </main>
  );
}
