
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLibrary, getCollections, deleteCollection } from '../services/libraryService';
import { Book, ShelfStatus, Collection } from '../types';
import BookCard from '../components/BookCard';
import { SHELF_LABELS } from '../constants';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, FolderHeart, LayoutGrid, ListFilter, X, Book as BookIcon, Zap } from 'lucide-react';

const Shelves: React.FC = () => {
  const [library, setLibrary] = useState<Book[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [viewMode, setViewMode] = useState<'books' | 'comics' | 'collections'>('books');
  const [activeShelf, setActiveShelf] = useState<ShelfStatus | 'all'>('all');
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLibrary(getLibrary());
    setCollections(getCollections());
  }, []);

  const librarySubset = viewMode === 'comics' 
    ? library.filter(b => b.isComic)
    : viewMode === 'books'
    ? library.filter(b => !b.isComic)
    : library;

  const filteredBooks = viewMode === 'collections' 
    ? (activeCollection 
        ? library.filter(b => collections.find(c => c.id === activeCollection)?.bookIds.includes(b.id))
        : [])
    : (activeShelf === 'all' ? librarySubset : librarySubset.filter(b => b.status === activeShelf));

  const shelfStats = {
    all: librarySubset.length,
    [ShelfStatus.READING]: librarySubset.filter(b => b.status === ShelfStatus.READING).length,
    [ShelfStatus.READ]: librarySubset.filter(b => b.status === ShelfStatus.READ).length,
    [ShelfStatus.WANT_TO_READ]: librarySubset.filter(b => b.status === ShelfStatus.WANT_TO_READ).length,
    [ShelfStatus.ABANDONED]: librarySubset.filter(b => b.status === ShelfStatus.ABANDONED).length,
  };

  const handleDeleteCollection = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('האם אתה בטוח שברצונך למחוק קטגוריה זו?')) {
      deleteCollection(id);
      setCollections(getCollections());
      if (activeCollection === id) setActiveCollection(null);
    }
  };

  return (
    <div className="space-y-12 pb-24">
      <header className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h2 className="text-4xl font-bold serif text-white tracking-tight">הספרייה שלי</h2>
          
          <div className="flex bg-[#161618] p-1 rounded-2xl border border-white/5 self-start overflow-hidden">
            <button 
              onClick={() => { setViewMode('books'); setActiveShelf('all'); }}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'books' ? 'bg-[#c5a059] text-black shadow-lg' : 'text-neutral-500 hover:text-white'}`}
            >
              <BookIcon size={14} /> ספרים
            </button>
            <button 
              onClick={() => { setViewMode('comics'); setActiveShelf('all'); }}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'comics' ? 'bg-[#c5a059] text-black shadow-lg' : 'text-neutral-500 hover:text-white'}`}
            >
              <Zap size={14} /> קומיקסים
            </button>
            <button 
              onClick={() => setViewMode('collections')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'collections' ? 'bg-[#c5a059] text-black shadow-lg' : 'text-neutral-500 hover:text-white'}`}
            >
              <FolderHeart size={14} /> קטגוריות
            </button>
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          {viewMode !== 'collections' ? (
            <motion.div 
              key="shelves-nav"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-wrap gap-2 border-b border-white/5 pb-6"
            >
              <button 
                onClick={() => setActiveShelf('all')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeShelf === 'all' ? 'bg-white/10 text-[#c5a059] border border-[#c5a059]/30' : 'text-neutral-500 hover:text-white'}`}
              >
                הכל ({shelfStats.all})
              </button>
              {Object.entries(SHELF_LABELS).map(([status, label]) => (
                <button 
                  key={status}
                  onClick={() => setActiveShelf(status as ShelfStatus)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeShelf === status ? 'bg-white/10 text-[#c5a059] border border-[#c5a059]/30' : 'text-neutral-500 hover:text-white'}`}
                >
                  {label} ({shelfStats[status as ShelfStatus]})
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="collections-nav"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap gap-4">
                {collections.map(col => (
                  <motion.div
                    key={col.id}
                    whileHover={{ y: -2 }}
                    onClick={() => setActiveCollection(col.id)}
                    className={`
                      group relative px-6 py-8 rounded-[2rem] border cursor-pointer transition-all min-w-[160px] flex flex-col items-center gap-3
                      ${activeCollection === col.id 
                        ? 'bg-[#c5a059] border-[#c5a059] text-black shadow-[0_15px_30px_rgba(197,160,89,0.3)]' 
                        : 'bg-[#161618] border-white/5 text-neutral-400 hover:border-[#c5a059]/30'}
                    `}
                  >
                    <FolderHeart size={32} className={activeCollection === col.id ? 'text-black' : 'text-[#c5a059]/50 group-hover:text-[#c5a059]'} />
                    <div className="text-center">
                      <p className="font-bold serif text-lg leading-tight">{col.name}</p>
                      <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${activeCollection === col.id ? 'text-black/60' : 'text-neutral-600'}`}>
                        {col.bookIds.length} פריטים
                      </p>
                    </div>
                    
                    <button 
                      onClick={(e) => handleDeleteCollection(e, col.id)}
                      className={`absolute top-3 left-3 p-1.5 rounded-lg transition-colors ${activeCollection === col.id ? 'hover:bg-black/10 text-black/40' : 'hover:bg-white/5 text-neutral-800 hover:text-rose-500'}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
                
                <button 
                  onClick={() => navigate('/search')}
                  className="px-6 py-8 rounded-[2rem] border-2 border-dashed border-white/5 text-neutral-600 hover:border-[#c5a059]/30 hover:text-[#c5a059] transition-all min-w-[160px] flex flex-col items-center justify-center gap-2 group"
                >
                  <Plus size={24} className="group-hover:scale-125 transition-transform" />
                  <span className="text-xs font-black uppercase tracking-widest">צור קטגוריה</span>
                </button>
              </div>

              {activeCollection && (
                <div className="flex items-center gap-4 text-neutral-500 border-t border-white/5 pt-6">
                  <ListFilter size={16} />
                  <span className="text-sm">מציג מתוך: <strong className="text-white serif">{collections.find(c => c.id === activeCollection)?.name}</strong></span>
                  <button onClick={() => setActiveCollection(null)} className="mr-auto text-xs font-bold hover:text-white flex items-center gap-1">
                    נקה סינון <X size={14} />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="relative min-h-[500px]">
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-20">
            <AnimatePresence mode="popLayout">
              {filteredBooks.map((book) => (
                <motion.div
                  key={book.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative group"
                >
                  <BookCard book={book} onClick={() => navigate(`/book/${book.id}`)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 text-center space-y-4">
            <div className="p-6 rounded-full bg-white/[0.02] border border-white/[0.05]">
              {viewMode === 'comics' ? <Zap size={48} className="text-neutral-800" /> : <BookIcon size={48} className="text-neutral-800" />}
            </div>
            <div>
              <h3 className="text-2xl serif text-neutral-600">אין כאן {viewMode === 'comics' ? 'קומיקסים' : 'ספרים'} עדיין...</h3>
              <p className="text-neutral-700 text-sm uppercase font-bold tracking-widest mt-2">הגיע הזמן למלא את המדפים ביצירות חדשות</p>
            </div>
            <button 
              onClick={() => navigate('/search')}
              className="mt-6 px-8 py-3 bg-[#c5a059]/10 border border-[#c5a059]/20 text-[#c5a059] rounded-2xl font-bold hover:bg-[#c5a059] hover:text-black transition-all"
            >
              גלה {viewMode === 'comics' ? 'קומיקסים חדשים' : 'ספרים חדשים'}
            </button>
          </div>
        )}
        
        {filteredBooks.length > 0 && <div className="absolute -bottom-2 left-0 right-0 wood-shelf" />}
      </div>
    </div>
  );
};

export default Shelves;
