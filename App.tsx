
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Search from './pages/Search';
import Shelves from './pages/Shelves';
import Stats from './pages/Stats';
import BookDetail from './pages/BookDetail';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex bg-[#0c0c0c] min-h-screen text-neutral-200 overflow-x-hidden">
        <Sidebar />
        
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
