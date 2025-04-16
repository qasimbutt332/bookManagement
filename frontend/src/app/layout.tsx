import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { FaBook } from 'react-icons/fa';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Book Management System',
  description: 'A simple book management system built with Next.js and Express',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen flex flex-col`}>
        <header className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="flex items-center text-xl font-bold text-gray-800">
                <FaBook className="mr-2 text-blue-600" />
                Book Management
              </Link>
              <nav>
                <ul className="flex space-x-4">
                  <li>
                    <Link href="/" className="text-gray-600 hover:text-blue-600">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/books/new" className="text-gray-600 hover:text-blue-600">
                      Add Book
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>
        
        <main className="flex-grow">
          {children}
        </main>
        
        <footer className="bg-white shadow-md mt-8">
          <div className="container mx-auto px-4 py-4">
            <p className="text-center text-gray-600">
              &copy; {new Date().getFullYear()} Book Management System. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
} 