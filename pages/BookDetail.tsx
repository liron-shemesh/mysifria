
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronRight, BookOpen, Trash2, Languages, Hash, Calendar, FolderHeart, Plus, Check, Trophy, Info, Zap } from 'lucide-react';
import { getBookById } from '../services/googleBooks';
import { getLibrary, saveToLibrary, removeFromLibrary, getCollections, saveCollection, toggleBookInCollection } from '../services/libraryService';
import { Book, ShelfStatus, GoogleBookItem, Collection } from '../types';

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bookData, setBookData] = useState<Book | null>(null);
  const [googleData, setGoogleData] = useState<GoogleBookItem | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Notification state
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      const local = getLibrary().find(b => b.id === id);
      if (local) {
        setBookData(local);
      }

      const remote = await getBookById(id);
      if (remote) {
        setGoogleData(remote);
      }
      
      setCollections(getCollections());
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const triggerNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAddToShelf = (status: ShelfStatus) => {
    if (!googleData) return;

    // Detect if it's likely a comic from Google's categories
    const categories = googleData.volumeInfo.categories || [];
    const isLikelyComic = categories.some(c => 
      c.toLowerCase().includes('comic') || 
      c.toLowerCase().includes('graphic novel') || 
      c.toLowerCase().includes('manga')
    );

    const newBook: Book = bookData ? { ...bookData, status } : {
      id: googleData.id,
      title: googleData.volumeInfo.title,
      subtitle: googleData.volumeInfo.subtitle,
      authors: googleData.volumeInfo.authors || [],
      thumbnail: googleData.volumeInfo.imageLinks?.thumbnail.replace('http:', 'https:') || '',
      description: googleData.volumeInfo.description || '',
      pageCount: googleData.volumeInfo.pageCount || 0,
      currentPage: status === ShelfStatus.READ ? (googleData.volumeInfo.pageCount || 0) : 0,
      rating: 0,
      notes: '',
      status,
      language: googleData.volumeInfo.language || 'עברית',
      categories,
      dateAdded: new Date().toISOString(),
      dateFinished: status === ShelfStatus.READ ? new Date().toISOString() : undefined,
      isComic: isLikelyComic
    };

    saveToLibrary(newBook);
    setBookData(newBook);
    
    if (status === ShelfStatus.READ) {
      triggerNotification('כל הכבוד! סיימת לקרוא את היצירה. 🎉', 'success');
    } else if (status === ShelfStatus.ABANDONED) {
      triggerNotification('הפריט הועבר למדף הנטושים. 💨', 'info');
    } else {
      triggerNotification('נוסף לספרייה שלך בהצלחה. ✨', 'success');
    }
  };

  const toggleIsComic = () => {
    if (!bookData) return;
    const updated = { ...bookData, isComic: !bookData.isComic };
    saveToLibrary(updated);
    setBookData(updated);
    triggerNotification(updated.isComic ? 'סומן כקומיקס/מאנגה' : 'הוסר מקטגוריית הקומיקס', 'info');
  };

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim() || !id) return;
    
    const newCol: Collection = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCollectionName.trim(),
      bookIds: [id],
      createdAt: new Date().toISOString()
    };
    
    if (!bookData) {
      handleAddToShelf(ShelfStatus.WANT_TO_READ);
    }
    
    saveCollection(newCol);
    setCollections(getCollections());
    setNewCollectionName('');
    setShowNewCollection(false);
    triggerNotification(`הקטגוריה "${newCol.name}" נוצרה והפריט נוסף אליה.`, 'success');
  };

  const handleToggleCollection = (colId: string) => {
    if (!id) return;
    
    if (!bookData) {
      handleAddToShelf(ShelfStatus.WANT_TO_READ);
    }
    
    const collection = collections.find(c => c.id === colId);
    const isAdding = !collection?.bookIds.includes(id);
    
    toggleBookInCollection(colId, id);
    setCollections(getCollections());
    
    triggerNotification(
      isAdding 
        ? `נוסף לקטגוריה "${collection?.name}"` 
        : `הוסר מהקטגוריה "${collection?.name}"`,
      'info'
    );
  };

  const handleUpdateRating = (rating: number) => {
    if (!bookData) return;
    const updated = { ...bookData, rating };
    saveToLibrary(updated);
    setBookData(updated);
    triggerNotification(`דירגת ב-${rating} כוכבים.`, 'info');
  };

  const handleUpdateProgress = (page: number) => {
    if (!bookData) return;
    const p = Math.max(0, Math.min(page, bookData.pageCount));
    const updated = { ...bookData, currentPage: p };
    if (p === bookData.pageCount && bookData.status !== ShelfStatus.READ) {
      updated.status = ShelfStatus.READ;
      updated.dateFinished = new Date().toISOString();
      triggerNotification('מדהים! סיימת את כל העמודים. 🎉', 'success');
    }
    saveToLibrary(updated);
    setBookData(updated);
  };

  const handleRemove = () => {
    if (!id) return;
    removeFromLibrary(id);
    navigate('/');
  };

  const handleAuthorClick = (author: string) => {
    navigate(`/search?q=inauthor:"${author}"`);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[70vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-[#c5a059]/30 border-t-[#c5a059] rounded-full animate-spin" />
        <div className="text-[#c5a059] serif text-xl font-light tracking-wide">שולף את היצירה מהמדף...</div>
      </div>
    </div>
  );

  const displayTitle = bookData?.title || googleData?.volumeInfo.title;
  const displayAuthors = bookData?.authors || googleData?.volumeInfo.authors || [];
  const displayImage = bookData?.thumbnail || googleData?.volumeInfo.imageLinks?.thumbnail.replace('http:', 'https:');
  const displayDesc = bookData?.description || googleData?.volumeInfo.description || 'אין תיאור זמין עבור ספר זה.';

  return (
    <div className="max-w-6xl mx-auto pb-24 px-4 sm:px-0">
      {/* Elegant Bottom-Rising Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ y: 100, opacity: 0, x: '-50%' }}
            animate={{ y: 0, opacity: 1, x: '-50%' }}
            exit={{ y: 50, opacity: 0, x: '-50%', scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4"
          >
            <div className="bg-[#161618] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-5 rounded-[2rem] flex items-center gap-4 backdrop-blur-xl relative overflow-hidden group">
              <div className={`absolute left-0 top-0 w-1.5 h-full ${notification.type === 'success' ? 'bg-[#c5a059]' : 'bg-neutral-600'}`} />
              <div className={`p-3 rounded-2xl ${notification.type === 'success' ? 'bg-[#c5a059]/10 text-[#c5a059]' : 'bg-white/5 text-neutral-400'}`}>
                {notification.type === 'success' ? <Trophy size={22} /> : <Info size={22} />}
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-bold serif leading-snug">{notification.message}</p>
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1 font-black">עדכון ספרייה</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-neutral-500 hover:text-[#c5a059] transition-all mb-10 group font-bold text-sm uppercase tracking-widest">
        <ChevronRight size={18} className="group-hover:-translate-x-2 transition-transform duration-500" />
        חזרה לספרייה
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20">
        {/* Left: Book Cover & Quick Actions */}
        <div className="md:col-span-4 space-y-10">
          <motion.div 
            layoutId={id}
            className="relative perspective-1000 group max-w-[320px] mx-auto md:max-w-none"
          >
            <div className="aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/5 bg-[#161618] md:group-hover:rotate-y-[-10deg] transition-transform duration-700 origin-right">
              {displayImage ? (
                <img src={displayImage} alt={displayTitle} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-10 text-center text-neutral-600 italic">
                  {displayTitle}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/5" />
            </div>
          </motion.div>

          <div className="space-y-6">
            {!bookData ? (
              <div className="grid grid-cols-1 gap-4">
                <button onClick={() => handleAddToShelf(ShelfStatus.READING)} className="w-full bg-[#c5a059] text-black py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-[#eaddca] transition-all shadow-xl">
                  <BookOpen size={18} /> התחל לקרוא
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => handleAddToShelf(ShelfStatus.WANT_TO_READ)} className="bg-[#161618] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] border border-white/5 hover:bg-white/5 transition-all">
                    רוצה לקרוא
                  </button>
                  <button onClick={() => handleAddToShelf(ShelfStatus.READ)} className="bg-[#161618] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] border border-white/5 hover:bg-white/5 transition-all">
                    כבר קראתי
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#111113] p-8 rounded-[2rem] border border-white/[0.04] space-y-8 shadow-2xl">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] font-black">סטטוס קריאה</p>
                    {/* Comic Toggle Button */}
                    <button 
                      onClick={toggleIsComic}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${bookData.isComic ? 'bg-[#c5a059] text-black shadow-lg shadow-[#c5a059]/20' : 'bg-white/5 text-neutral-500 border border-white/5'}`}
                    >
                      <Zap size={10} /> קומיקס
                    </button>
                  </div>
                  <select 
                    value={bookData.status} 
                    onChange={(e) => handleAddToShelf(e.target.value as ShelfStatus)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white appearance-none outline-none focus:border-[#c5a059]/50 transition-all cursor-pointer font-bold"
                  >
                    <option value={ShelfStatus.READING}>📖 קורא עכשיו</option>
                    <option value={ShelfStatus.READ}>✅ קראתי</option>
                    <option value={ShelfStatus.WANT_TO_READ}>⏳ רוצה לקרוא</option>
                    <option value={ShelfStatus.ABANDONED}>💨 נטשתי</option>
                  </select>
                </div>

                {bookData.status === ShelfStatus.READING && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] font-black">התקדמות</p>
                      <span className="text-sm font-black text-[#c5a059] tracking-tighter">{Math.round((bookData.currentPage / bookData.pageCount) * 100)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max={bookData.pageCount} 
                      value={bookData.currentPage}
                      onChange={(e) => handleUpdateProgress(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-black/40 rounded-full appearance-none accent-[#c5a059] cursor-pointer border border-white/5"
                    />
                    <div className="flex justify-between mt-3 text-[10px] text-neutral-600 font-bold uppercase tracking-wider">
                      <span>0 עמ'</span>
                      <span>{bookData.pageCount} עמ'</span>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] font-black mb-4">הדירוג שלי</p>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        onClick={() => handleUpdateRating(star)}
                        className={`transition-all hover:scale-125 ${star <= bookData.rating ? 'text-[#c5a059]' : 'text-neutral-800'}`}
                      >
                        <Star size={26} fill={star <= bookData.rating ? "currentColor" : "none"} strokeWidth={1.5} />
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={handleRemove} className="w-full flex items-center justify-center gap-2 text-rose-500/40 hover:text-rose-500 text-[10px] font-black uppercase tracking-[0.2em] transition-all pt-6 border-t border-white/5">
                  <Trash2 size={14} /> הסר מהספרייה
                </button>
              </div>
            )}

            {/* Collections Management Section */}
            <div className="bg-[#111113] p-8 rounded-[2rem] border border-white/[0.04] space-y-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] font-black">קטגוריות אישיות</p>
                <button 
                  onClick={() => setShowNewCollection(!showNewCollection)}
                  className="text-[#c5a059] hover:text-white transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {collections.map(col => {
                  const isChecked = id ? col.bookIds.includes(id) : false;
                  return (
                    <button
                      key={col.id}
                      onClick={() => handleToggleCollection(col.id)}
                      className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border
                        ${isChecked 
                          ? 'bg-[#c5a059]/20 border-[#c5a059]/40 text-[#c5a059]' 
                          : 'bg-white/5 border-white/5 text-neutral-500 hover:border-white/20'}
                      `}
                    >
                      <FolderHeart size={12} className={isChecked ? 'fill-current' : ''} />
                      {col.name}
                      {isChecked && <Check size={10} />}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {showNewCollection && (
                  <motion.form 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    onSubmit={handleCreateCollection}
                    className="overflow-hidden space-y-3"
                  >
                    <input 
                      type="text"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      placeholder="שם קטגוריה חדשה..."
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-[#c5a059]/40"
                      autoFocus
                    />
                    <button 
                      type="submit"
                      disabled={!newCollectionName.trim()}
                      className="w-full bg-[#c5a059]/10 border border-[#c5a059]/20 text-[#c5a059] py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#c5a059] hover:text-black transition-all disabled:opacity-30"
                    >
                      צור קטגוריה
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right: Info & Metadata */}
        <div className="md:col-span-8 space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold serif text-white leading-[1.1] tracking-tight">{displayTitle}</h1>
            {googleData?.volumeInfo.subtitle && (
              <h2 className="text-2xl md:text-3xl text-neutral-500 serif font-light italic">{googleData.volumeInfo.subtitle}</h2>
            )}
            <div className="flex flex-wrap items-center gap-3 text-xl md:text-2xl text-[#c5a059]/90 serif font-medium pt-2">
              <span className="opacity-60 text-base font-bold uppercase tracking-widest font-sans">מאת</span>
              {displayAuthors.map((author, idx) => (
                <React.Fragment key={author}>
                  <button 
                    onClick={() => handleAuthorClick(author)}
                    className="hover:text-white transition-all underline decoration-white/10 underline-offset-8"
                  >
                    {author}
                  </button>
                  {idx < displayAuthors.length - 1 && <span className="text-neutral-700">|</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <div className="bg-[#161618] px-5 py-3 rounded-2xl border border-white/5 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-neutral-400">
              <Languages size={16} className="text-[#c5a059]" /> {bookData?.language || googleData?.volumeInfo.language}
            </div>
            <div className="bg-[#161618] px-5 py-3 rounded-2xl border border-white/5 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-neutral-400">
              <Hash size={16} className="text-[#c5a059]" /> {bookData?.pageCount || googleData?.volumeInfo.pageCount} עמודים
            </div>
            {bookData?.dateAdded && (
              <div className="bg-[#161618] px-5 py-3 rounded-2xl border border-white/5 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-neutral-400">
                <Calendar size={16} className="text-[#c5a059]" /> {new Date(bookData.dateAdded).toLocaleDateString('he-IL')}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold serif text-[#c5a059] uppercase tracking-widest">תקציר היצירה</h3>
            <div 
              className="text-neutral-400 leading-loose text-lg font-light tracking-wide"
              dangerouslySetInnerHTML={{ __html: displayDesc }}
            />
          </div>

          {(bookData?.notes || bookData) && (
            <div className="space-y-6 pt-6">
              <h3 className="text-xl font-bold serif text-[#c5a059] uppercase tracking-widest">רשמים אישיים</h3>
              <div className="relative group">
                <textarea 
                  value={bookData?.notes || ''}
                  onChange={(e) => {
                    if (bookData) {
                      const updated = { ...bookData, notes: e.target.value };
                      saveToLibrary(updated);
                      setBookData(updated);
                    }
                  }}
                  placeholder="כתוב כאן מחשבות, ציטוטים אהובים או ביקורת על הספר..."
                  className="w-full bg-[#111113] border border-white/5 rounded-[2rem] p-8 text-white min-h-[200px] outline-none focus:border-[#c5a059]/30 transition-all shadow-xl text-lg font-light tracking-wide placeholder:text-neutral-700"
                />
                <div className="absolute top-4 right-4 text-[10px] text-neutral-800 font-black uppercase tracking-widest group-focus-within:text-[#c5a059]/40 transition-colors">Personal Notes</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
