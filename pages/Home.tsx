
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getLibrary, getStats } from '../services/libraryService';
import { Book, ShelfStatus, LibraryStats, GoogleBookItem } from '../types';
import BookCard from '../components/BookCard';
import { BookOpen, CheckCircle, Clock, ChevronLeft, ArrowLeft, Sparkles, Loader2, Library as LibraryIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchBooks } from '../services/googleBooks';

const Home: React.FC = () => {
  const [library, setLibrary] = useState<Book[]>([]);
  const [stats, setStats] = useState<LibraryStats | null>(null);
  const [recommendations, setRecommendations] = useState<GoogleBookItem[]>([]);
  const [isRecLoading, setIsRecLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const lib = getLibrary();
    setLibrary(lib);
    setStats(getStats());
    fetchRecommendations(lib);
  }, []);

  const fetchRecommendations = async (lib: Book[]) => {
    const readBooks = lib.filter(b => b.status === ShelfStatus.READ || b.status === ShelfStatus.READING);
    if (readBooks.length === 0) return;

    setIsRecLoading(true);
    const randomBook = readBooks[Math.floor(Math.random() * readBooks.length)];
    const query = randomBook.categories?.[0] || randomBook.authors?.[0];

    if (query) {
      const results = await searchBooks(query);
      const filtered = results.filter(res => !lib.some(l => l.id === res.id)).slice(0, 6);
      setRecommendations(filtered);
    }
    setIsRecLoading(false);
  };

  const readingNow = library.filter(b => b.status === ShelfStatus.READING);

  const StatItem = ({ label, value, icon: Icon, color }: any) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, borderColor: 'rgba(197, 160, 89, 0.2)' }}
      className="p-6 rounded-3xl bg-white dark:bg-[#161618] border border-black/5 dark:border-white/[0.05] flex items-center gap-5 transition-all shadow-md dark:shadow-lg"
    >
      <div className={`p-3.5 rounded-2xl bg-opacity-10 ${color}`}>
        <Icon className={color.replace('bg-', 'text-')} size={24} />
      </div>
      <div>
        <p className="text-[11px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-neutral-800 dark:text-white serif mt-0.5">{value}</p>
      </div>
    </motion.div>
  );

  const handleAuthorClick = (e: React.MouseEvent, author: string) => {
    e.stopPropagation();
    navigate(`/search?q=inauthor:"${author}"`);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Enhanced Premium Header Section */}
      <header className="relative pt-12 pb-16 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c5a059]/10 blur-[120px] -z-10 rounded-full animate-pulse" />
        <div className="absolute -bottom-10 left-10 w-64 h-64 bg-indigo-500/5 blur-[100px] -z-10 rounded-full" />
        
        <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12 relative z-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            className="w-24 h-24 bg-gradient-to-br from-[#c5a059] to-[#8e6e3d] rounded-[2.5rem] flex items-center justify-center shadow-xl relative group cursor-default"
          >
            <LibraryIcon className="text-black" size={40} />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-10px] border border-[#c5a059]/20 rounded-[3rem] opacity-50"
            />
          </motion.div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="h-[1px] w-12 bg-[#c5a059]/30" />
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#c5a059]">Welcome Back</span>
            </div>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-5xl md:text-7xl font-bold serif text-neutral-900 dark:text-white tracking-tight leading-none"
            >
              ברוכים השבים ל<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c5a059] to-[#eaddca] italic">ספרייה</span>
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-neutral-500 dark:text-neutral-400 text-lg md:text-xl font-light max-w-2xl leading-relaxed"
            >
              מקום שבו סיפורים מתעוררים לחיים. כאן נשמרים הרגעים, הידע והמסעות שלך בין הדפים.
            </motion.p>
          </div>
        </div>
      </header>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatItem label="ספרים שנקראו" value={stats.read} icon={CheckCircle} color="bg-emerald-500" />
          <StatItem label="קורא עכשיו" value={stats.reading} icon={BookOpen} color="bg-indigo-500" />
          <StatItem label="בתור לקריאה" value={stats.wantToRead} icon={Clock} color="bg-amber-500" />
          <StatItem label="עמודים שנקראו" value={stats.pagesRead.toLocaleString()} icon={ChevronLeft} color="bg-rose-500" />
        </div>
      )}

      {readingNow.length > 0 && (
        <section className="space-y-8">
          <div className="flex justify-between items-end border-b border-black/5 dark:border-white/[0.05] pb-4">
            <h3 className="text-2xl font-bold serif text-[#c5a059] flex items-center gap-3">
              <BookOpen size={24} className="opacity-80" />
              קורא עכשיו
            </h3>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {readingNow.map(book => {
              const progress = Math.round((book.currentPage / book.pageCount) * 100);
              return (
                <motion.div 
                  key={book.id} 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.01, borderColor: 'rgba(197, 160, 89, 0.3)' }}
                  className="bg-white dark:bg-[#161618] p-7 rounded-[2.5rem] border border-black/5 dark:border-white/[0.05] flex flex-col sm:flex-row gap-8 transition-all cursor-pointer group relative overflow-hidden shadow-lg dark:shadow-2xl"
                  onClick={() => navigate(`/book/${book.id}`)}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c5a059]/10 to-transparent" />
                  
                  <div className="w-full sm:w-36 aspect-[2/3] shadow-xl rounded-xl overflow-hidden flex-shrink-0 group-hover:scale-[1.03] transition-transform duration-700">
                    <img src={book.thumbnail} className="w-full h-full object-cover" alt={book.title} />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div>
                      <h4 className="text-2xl font-bold serif leading-tight text-neutral-900 dark:text-white group-hover:text-[#c5a059] transition-colors">{book.title}</h4>
                      <button 
                        onClick={(e) => handleAuthorClick(e, book.authors[0])}
                        className="text-[13px] text-neutral-400 dark:text-neutral-500 mt-2 font-medium hover:text-[#c5a059] transition-colors"
                      >
                        מאת: {book.authors.join(', ')}
                      </button>
                    </div>

                    <div className="space-y-5 mt-6 sm:mt-0">
                      <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                          <span className="text-4xl font-bold text-[#c5a059] serif leading-none tracking-tighter">{progress}%</span>
                          <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 font-black mt-2">התקדמות קריאה</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block font-bold uppercase tracking-wider">עמוד {book.currentPage} / {book.pageCount}</span>
                          <span className="text-[10px] text-neutral-400 dark:text-neutral-600 block uppercase font-bold mt-1">נותרו {book.pageCount - book.currentPage} עמ'</span>
                        </div>
                      </div>

                      <div className="relative pt-2">
                        <div className="h-2 bg-black/5 dark:bg-black/40 rounded-full overflow-hidden border border-black/5 dark:border-white/[0.03]">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.8, ease: "circOut" }}
                            className="h-full bg-gradient-to-r from-[#8e6e3d] via-[#c5a059] to-[#8e6e3d] relative"
                          >
                            <motion.div
                              animate={{ x: ['-100%', '250%'] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-32"
                            />
                          </motion.div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button className="flex items-center gap-2 text-[10px] font-black text-[#c5a059] uppercase tracking-[0.2em] hover:text-neutral-800 dark:hover:text-white transition-all group/btn">
                          המשך לקרוא <ArrowLeft size={14} className="group-hover/btn:-translate-x-1.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {recommendations.length > 0 && (
        <section className="space-y-10">
          <div className="flex justify-between items-end border-b border-black/5 dark:border-white/[0.05] pb-4">
            <h3 className="text-2xl font-bold serif text-[#c5a059] flex items-center gap-3">
              <Sparkles size={24} className="opacity-80" />
              במיוחד בשבילך
            </h3>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest font-black">מבוסס על הטעם שלך</p>
          </div>
          <div className="relative pt-6">
            {isRecLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-[#c5a059]" size={32} />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-20">
                {recommendations.map(book => (
                  <div key={book.id} className="relative z-10">
                    <BookCard book={book} onClick={() => navigate(`/book/${book.id}`)} />
                  </div>
                ))}
              </div>
            )}
            {!isRecLoading && recommendations.length > 0 && <div className="absolute -bottom-2 left-0 right-0 wood-shelf" />}
          </div>
        </section>
      )}

      <section className="space-y-10">
        <div className="flex justify-between items-end border-b border-black/5 dark:border-white/[0.05] pb-4">
          <h3 className="text-2xl font-bold serif text-[#c5a059]">ספרים על המדף</h3>
          <button onClick={() => navigate('/shelves')} className="text-xs font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 hover:text-[#c5a059] transition-all flex items-center gap-2">
            צפה בכל המדפים <ChevronLeft size={14} />
          </button>
        </div>
        
        <div className="relative pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-20">
            {library.length > 0 ? (
              library.slice(0, 6).map(book => (
                <div key={book.id} className="relative z-10">
                  <BookCard book={book} onClick={() => navigate(`/book/${book.id}`)} />
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-neutral-500 italic border border-black/5 dark:border-white/[0.03] bg-black/[0.01] dark:bg-white/[0.01] rounded-[2.5rem]">
                <p className="text-lg serif opacity-50">עדיין אין ספרים במדף.</p>
                <button onClick={() => navigate('/search')} className="mt-4 text-[#c5a059] font-bold hover:underline">חפש ספרים כדי להתחיל</button>
              </div>
            )}
          </div>
          {library.length > 0 && <div className="absolute -bottom-2 left-0 right-0 wood-shelf" />}
        </div>
      </section>
    </div>
  );
};

export default Home;
