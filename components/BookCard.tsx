
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Book } from '../types';
import { SHELF_LABELS } from '../constants';

interface BookCardProps {
  book: Book | any;
  onClick?: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  const navigate = useNavigate();
  const thumbnail = book.thumbnail || (book.volumeInfo?.imageLinks?.thumbnail);
  const title = book.title || book.volumeInfo?.title;
  const authors = book.authors || book.volumeInfo?.authors || ['מחבר לא ידוע'];
  const rating = book.rating || 0;

  const handleAuthorClick = (e: React.MouseEvent, author: string) => {
    e.stopPropagation();
    navigate(`/search?q=inauthor:"${author}"`);
  };

  return (
    <motion.div
      whileHover={{ 
        y: -15, 
        rotateY: -10,
        z: 50,
        transition: { duration: 0.3 }
      }}
      className="relative group cursor-pointer perspective-1000 w-full"
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        {/* The 3D Book Cover */}
        <div className="relative shadow-xl dark:shadow-2xl rounded-sm overflow-hidden aspect-[2/3] w-full max-w-[160px] bg-neutral-200 dark:bg-neutral-800 border border-black/5 dark:border-neutral-700/50">
          {thumbnail ? (
            <img 
              src={thumbnail.replace('http:', 'https:')} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-4 text-center text-xs text-neutral-400 dark:text-neutral-500 italic">
              {title}
            </div>
          )}
          
          {/* Cover Overlay/Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 dark:from-black/40 via-transparent to-white/10 dark:to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Status Badge */}
          {book.status && (
            <div className="absolute top-2 left-2 bg-white/90 dark:bg-black/70 backdrop-blur-sm text-[10px] px-1.5 py-0.5 rounded border border-[#c5a059]/30 text-[#c5a059] font-bold shadow-sm">
              {SHELF_LABELS[book.status]}
            </div>
          )}
        </div>

        {/* Info on the shelf floor */}
        <div className="mt-3 text-center px-2 w-full">
          <h3 className="text-sm font-semibold truncate text-neutral-800 dark:text-neutral-100 serif">{title}</h3>
          <button 
            onClick={(e) => handleAuthorClick(e, authors[0])}
            className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5 hover:text-[#c5a059] transition-colors inline-block max-w-full"
          >
            {authors[0]}
          </button>
          
          {rating > 0 && (
            <div className="flex items-center justify-center gap-0.5 mt-1 text-[#c5a059]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} fill={i < rating ? "currentColor" : "none"} strokeWidth={1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
