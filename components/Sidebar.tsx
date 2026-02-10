
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NAVIGATION } from '../constants';
import { Library as LibraryIcon, Menu, X, ArrowRight } from 'lucide-react';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // סגירה של הסרגל בנייד לאחר ניווט
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleMouseEnter = () => {
    if (window.innerWidth < 768) return; // Ignore on mobile
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (window.innerWidth < 768) return; // Ignore on mobile
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 right-5 z-[80] p-3.5 bg-[#161618] border border-white/10 rounded-2xl text-[#c5a059] shadow-[0_10px_30px_rgba(0,0,0,0.5)] md:hidden active:scale-95 transition-all"
        aria-label={isOpen ? "סגור תפריט" : "פתח תפריט"}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Hover Trigger Zone - Invisible but handles mouse events */}
      <div 
        className="fixed top-0 right-0 h-full z-[60] hidden md:block"
        style={{ width: isOpen ? '320px' : '30px' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      {/* Main Sidebar Component */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`
          fixed top-0 right-0 h-full z-[75]
          w-[85vw] max-w-[320px] md:w-72
          bg-[#0a0a0b]/95 backdrop-blur-2xl border-l border-white/10
          shadow-[-20px_0_60px_rgba(0,0,0,0.8)]
          flex flex-col overflow-hidden
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Mobile-only Close Header */}
        <div className="flex items-center justify-between p-8 md:hidden border-b border-white/5">
          <div className="flex items-center gap-3">
            <LibraryIcon className="text-[#c5a059]" size={20} />
            <span className="text-white font-bold serif">תפריט</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-neutral-500 hover:text-white p-1"
          >
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Brand Section */}
        <div className="p-10 flex items-center gap-4">
          <motion.div 
            animate={{ rotate: isOpen ? 360 : 0 }}
            className="p-2.5 bg-gradient-to-br from-[#c5a059] to-[#8e6e3d] rounded-2xl shadow-[0_0_20px_rgba(197,160,89,0.3)]"
          >
            <LibraryIcon className="text-black" size={20} />
          </motion.div>
          <h1 className="text-2xl font-bold text-[#c5a059] serif tracking-tight">MyBooks</h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-6 space-y-3 overflow-y-auto pt-4">
          {NAVIGATION.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative
                ${isActive 
                  ? 'bg-white/5 text-[#c5a059] border border-white/5' 
                  : 'text-neutral-500 hover:text-white hover:bg-white/[0.02]'}`
              }
            >
              <span className="transition-transform group-hover:scale-110">
                {item.icon}
              </span>
              <span className="font-semibold tracking-wide text-sm">{item.label}</span>
              
              <AnimatePresence>
                {location.pathname === item.path && (
                  <motion.div 
                    layoutId="activeDot"
                    className="mr-auto w-1.5 h-1.5 rounded-full bg-[#c5a059] shadow-[0_0_10px_rgba(197,160,89,1)]"
                  />
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Card */}
        <div className="p-8 mt-auto">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1e1e21] to-[#161618] border border-white/[0.05] text-center relative overflow-hidden group shadow-xl">
            <div className="absolute inset-0 bg-[#c5a059]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <p className="text-[10px] text-[#c5a059]/70 uppercase font-black mb-1 relative z-10 tracking-widest">הספרייה שלך</p>
            <p className="text-[11px] text-neutral-400 relative z-10">ניהול קריאה חכם ואלגנטי</p>
          </div>
        </div>
      </motion.div>

      {/* Overlay Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 z-[70] backdrop-blur-[6px] cursor-pointer"
          />
        )}
      </AnimatePresence>

      {/* Edge indicator when closed */}
      {!isOpen && (
        <div className="fixed top-1/2 -translate-y-1/2 right-1 z-[55] w-1.5 h-24 bg-gradient-to-b from-transparent via-[#c5a059]/20 to-transparent rounded-full blur-[1px] hidden md:block" />
      )}
    </>
  );
};

export default Sidebar;
