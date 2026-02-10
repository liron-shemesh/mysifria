
export enum ShelfStatus {
  READING = 'reading',
  READ = 'read',
  WANT_TO_READ = 'want-to-read',
  ABANDONED = 'abandoned'
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  authors: string[];
  thumbnail: string;
  description: string;
  pageCount: number;
  currentPage: number;
  rating: number; // 0-5
  notes: string;
  status: ShelfStatus;
  language: string;
  categories: string[];
  dateAdded: string;
  dateFinished?: string;
  abandonReason?: string;
  isComic?: boolean;
}

export interface Collection {
  id: string;
  name: string;
  bookIds: string[];
  createdAt: string;
}

export interface GoogleBookItem {
  id: string;
  volumeInfo: {
    title: string;
    subtitle?: string;
    authors?: string[];
    description?: string;
    pageCount?: number;
    language?: string;
    categories?: string[];
    imageLinks?: {
      thumbnail: string;
    };
  };
}

export interface LibraryStats {
  totalBooks: number;
  reading: number;
  read: number;
  wantToRead: number;
  abandoned: number;
  pagesRead: number;
}
