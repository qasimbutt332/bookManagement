import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  publishedYear: number;
  isbn: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookDto {
  title: string;
  author: string;
  description: string;
  publishedYear: number;
  isbn: string;
}

export interface UpdateBookDto extends Partial<CreateBookDto> {}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAllBooks = async (): Promise<Book[]> => {
  try {
    const response = await api.get<Book[]>('/books');
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const getBookById = async (id: string): Promise<Book> => {
  try {
    const response = await api.get<Book>(`/books/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching book:', error);
    throw error;
  }
};

export const createBook = async (book: CreateBookDto): Promise<Book> => {
  try {
    const response = await api.post<Book>('/books', book);
    return response.data;
  } catch (error) {
    console.error('Error creating book:', error);
    throw error;
  }
};

export const updateBook = async (id: string, book: UpdateBookDto): Promise<Book> => {
  try {
    const response = await api.put<Book>(`/books/${id}`, book);
    return response.data;
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

export const deleteBook = async (id: string): Promise<void> => {
  try {
    await api.delete(`/books/${id}`);
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
}; 