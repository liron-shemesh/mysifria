
import { GoogleBookItem } from '../types';

const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

export const searchBooks = async (query: string): Promise<GoogleBookItem[]> => {
  if (!query) return [];
  try {
    const response = await fetch(`${BASE_URL}?q=${encodeURIComponent(query)}&maxResults=20`);
    if (!response.ok) throw new Error('Failed to fetch books');
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
};

export const getBookById = async (id: string): Promise<GoogleBookItem | null> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch book details');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting book details:', error);
    return null;
  }
};
