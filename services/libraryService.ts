
import { Book, ShelfStatus, LibraryStats, Collection } from '../types';

const STORAGE_KEY = 'mybooks_library_v1';
const COLLECTIONS_KEY = 'mybooks_collections_v1';

export const getLibrary = (): Book[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveToLibrary = (book: Book) => {
  const library = getLibrary();
  const index = library.findIndex(b => b.id === book.id);
  if (index >= 0) {
    library[index] = book;
  } else {
    library.push(book);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
};

export const removeFromLibrary = (bookId: string) => {
  const library = getLibrary().filter(b => b.id !== bookId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
  
  // Also remove from all collections
  const collections = getCollections();
  const updatedCollections = collections.map(c => ({
    ...c,
    bookIds: c.bookIds.filter(id => id !== bookId)
  }));
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(updatedCollections));
};

export const getStats = (): LibraryStats => {
  const library = getLibrary();
  return {
    totalBooks: library.length,
    reading: library.filter(b => b.status === ShelfStatus.READING).length,
    read: library.filter(b => b.status === ShelfStatus.READ).length,
    wantToRead: library.filter(b => b.status === ShelfStatus.WANT_TO_READ).length,
    abandoned: library.filter(b => b.status === ShelfStatus.ABANDONED).length,
    pagesRead: library.reduce((acc, b) => acc + (b.status === ShelfStatus.READ ? b.pageCount : b.currentPage), 0)
  };
};

export const getCollections = (): Collection[] => {
  const data = localStorage.getItem(COLLECTIONS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveCollection = (collection: Collection) => {
  const collections = getCollections();
  const index = collections.findIndex(c => c.id === collection.id);
  if (index >= 0) {
    collections[index] = collection;
  } else {
    collections.push(collection);
  }
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
};

export const deleteCollection = (id: string) => {
  const collections = getCollections().filter(c => c.id !== id);
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
};

export const toggleBookInCollection = (collectionId: string, bookId: string) => {
  const collections = getCollections();
  const collection = collections.find(c => c.id === collectionId);
  if (collection) {
    const hasBook = collection.bookIds.includes(bookId);
    if (hasBook) {
      collection.bookIds = collection.bookIds.filter(id => id !== bookId);
    } else {
      collection.bookIds.push(bookId);
    }
    saveCollection(collection);
  }
};
