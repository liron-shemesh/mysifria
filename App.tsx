
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Search from './pages/Search';
import Shelves from './pages/Shelves';
import Stats from './pages/Stats';
import BookDetail from './pages/BookDetail';

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <Router>
      <div className="flex bg-[#fdfaf6] dark:bg-[#0a0a0b] min-h-screen text-neutral-800 dark:text-neutral-200 overflow-x-hidden transition-colors duration-500">
        <Sidebar toggleTheme={toggleTheme} isDark={isDark} />
        
        {/* Main Content Area */}
        <main className="flex-1 w-full p-4 sm:p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto pt-14 md:pt-0"
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/shelves" element={<Shelves />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/book/:id" element={<BookDetail />} />
            </Routes>
          </motion.div>
        </main>
      </div>
    </Router>
  );
};

export default App;
