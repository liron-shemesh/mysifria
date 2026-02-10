
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NAVIGATION } from '../constants';
import { Library as LibraryIcon, Menu, X, ArrowRight, Sun, Moon } from 'lucide-react';

interface SidebarProps {
  toggleTheme?: () => void;
  isDark?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ toggleTheme, isDark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleMouseEnter = () => {
    if (window.innerWidth < 768) return;
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (window.innerWidth < 768) return;
    closeTimeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 right-5 z-[80] p-3.5 bg-white dark:bg-[#161618] border border-black/5 dark:border-white/10 rounded-2xl text-[#c5a059] shadow-xl md:hidden active:scale-95 transition-all"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div 
        className="fixed top-0 right-0 h-full z-[60] hidden md:block"
        style={{ width: isOpen ? '320px' : '30px' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`
          fixed top-0 right-0 h-full z-[75]
          w-[85vw] max-w-[320px] md:w-72
          bg-white/90 dark:bg-[#0a0a0b]/95 backdrop-blur-2xl border-l border-black/5 dark:border-white/10
          shadow-[-20px_0_60px_rgba(0,0,0,0.1)] dark:shadow-[-20px_0_60px_rgba(0,0,0,0.8)]
          flex flex-col overflow-hidden transition-colors duration-500
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center justify-between p-8 md:hidden border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-3">
            <LibraryIcon className="text-[#c5a059]" size={20} />
            <span className="text-black dark:text-white font-bold serif">תפריט</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-neutral-400 dark:text-neutral-500 hover:text-black dark:hover:text-white p-1">
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="p-10 flex items-center gap-4">
          <motion.div 
            animate={{ rotate: isOpen ? 360 : 0 }}
            className="p-2.5 bg-gradient-to-br from-[#c5a059] to-[#8e6e3d] rounded-2xl shadow-lg"
          >
            <LibraryIcon className="text-black" size={20} />
          </motion.div>
          <h1 className="text-2xl font-bold text-[#c5a059] serif tracking-tight">MyBooks</h1>
        </div>

        <nav className="flex-1 px-6 space-y-3 overflow-y-auto pt-4">
          {NAVIGATION.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative
                ${isActive 
                  ? 'bg-black/5 dark:bg-white/5 text-[#c5a059] border border-black/5 dark:border-white/5 shadow-inner' 
                  : 'text-neutral-500 dark:text-neutral-500 hover:text-black dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'}`
              }
            >
              <span className="transition-transform group-hover:scale-110">{item.icon}</span>
              <span className="font-semibold tracking-wide text-sm">{item.label}</span>
              {location.pathname === item.path && (
                <motion.div layoutId="activeDot" className="mr-auto w-1.5 h-1.5 rounded-full bg-[#c5a059] shadow-[0_0_10px_rgba(197,160,89,1)]" />
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-8 space-y-4">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all text-neutral-600 dark:text-neutral-400 font-bold text-xs uppercase tracking-widest"
          >
            <span>{isDark ? 'מצב בהיר' : 'מצב כהה'}</span>
            {isDark ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-indigo-500" />}
          </button>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-[#1e1e21] dark:to-[#161618] border border-black/5 dark:border-white/[0.05] text-center relative overflow-hidden group shadow-md dark:shadow-xl transition-all">
            <div className="absolute inset-0 bg-[#c5a059]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <p className="text-[10px] text-[#c5a059] dark:text-[#c5a059]/70 uppercase font-black mb-1 relative z-10 tracking-widest">הספרייה שלך</p>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 relative z-10">ניהול קריאה חכם ואלגנטי</p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 dark:bg-black/80 z-[70] backdrop-blur-[4px] dark:backdrop-blur-[6px] cursor-pointer"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
