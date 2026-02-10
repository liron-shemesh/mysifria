
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { searchBooks } from '../services/googleBooks';
import { GoogleBookItem } from '../types';
import BookCard from '../components/BookCard';

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<GoogleBookItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    const books = await searchBooks(searchQuery);
    setResults(books);
    setIsLoading(false);
  };

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchParams({ q: query });
  };

  return (
    <div className="space-y-16 pb-20">
      <header className="max-w-3xl mx-auto text-center space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold serif text-neutral-900 dark:text-white px-4 tracking-tight leading-tight">מצא את הספר הבא שלך <span className="text-[#c5a059] block text-2xl mt-2 font-normal italic">בספרייה העולמית</span></h2>
        <form onSubmit={handleSearch} className="relative group px-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="חפש לפי שם ספר, מחבר או נושא..."
            className="w-full bg-white dark:bg-[#161618] border border-black/10 dark:border-white/[0.05] rounded-[2rem] py-5 sm:py-6 px-14 sm:px-16 text-neutral-800 dark:text-white focus:outline-none focus:border-[#c5a059]/40 transition-all text-base sm:text-xl shadow-xl dark:shadow-2xl font-light tracking-wide placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
          />
          <SearchIcon className="absolute right-10 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-600 group-focus-within:text-[#c5a059] transition-all duration-500" size={24} />
          <button 
            type="submit"
            className="absolute left-8 top-1/2 -translate-y-1/2 bg-[#c5a059] text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs hover:bg-[#eaddca] transition-all shadow-xl active:scale-95"
          >
            חפש
          </button>
        </form>
      </header>

      <div className="relative min-h-[400px]">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 border-2 border-[#c5a059]/20 border-t-[#c5a059] rounded-full animate-spin" />
            <p className="text-neutral-500 animate-pulse text-sm font-bold uppercase tracking-[0.2em]">שולף תוצאות רלוונטיות...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 sm:gap-x-10 gap-y-16 sm:gap-y-20 px-2">
            <AnimatePresence mode="popLayout">
              {results.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.04,
                    type: "spring",
                    stiffness: 100,
                    damping: 20
                  }}
                  className="relative"
                >
                  <BookCard 
                    book={book} 
                    onClick={() => navigate(`/book/${book.id}`)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!isLoading && results.length === 0 && query && (
          <div className="text-center py-32 border border-black/5 dark:border-white/[0.03] bg-black/[0.01] dark:bg-white/[0.01] rounded-[3rem]">
            <p className="text-neutral-400 dark:text-neutral-500 text-lg serif px-4 opacity-60">לא מצאנו תוצאות עבור "{query}"</p>
            <p className="text-neutral-500 dark:text-neutral-700 text-sm mt-2 uppercase tracking-widest">נסה לחפש מונח אחר או בדוק שגיאות כתיב</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
