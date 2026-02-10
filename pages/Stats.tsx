
import React, { useEffect, useState } from 'react';
import { getLibrary, getStats } from '../services/libraryService';
import { Book, ShelfStatus } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { COLORS } from '../constants';

const Stats: React.FC = () => {
  const [library, setLibrary] = useState<Book[]>([]);
  const stats = getStats();

  useEffect(() => {
    setLibrary(getLibrary());
  }, []);

  const pieData = [
    { name: 'קראתי', value: stats.read, color: '#10b981' },
    { name: 'קורא עכשיו', value: stats.reading, color: '#3b82f6' },
    { name: 'רוצה לקרוא', value: stats.wantToRead, color: '#f59e0b' },
    { name: 'נטשתי', value: stats.abandoned, color: '#ef4444' },
  ].filter(d => d.value > 0);

  // Stats by category (top 5)
  const categoryCount: Record<string, number> = {};
  library.forEach(b => {
    b.categories.forEach(cat => {
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
  });
  const barData = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-12 pb-20">
      <header>
        <h2 className="text-4xl font-bold serif text-white tracking-tight">הסטטיסטיקות שלי</h2>
        <p className="text-neutral-500 mt-2 font-light">הרגלי הקריאה שלך בנתונים ותצוגות ויזואליות.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#161618] p-8 rounded-[2.5rem] border border-white/[0.05] shadow-2xl space-y-8">
          <h3 className="text-xl font-bold serif text-[#c5a059] uppercase tracking-widest">התפלגות ספרים</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#111113', 
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '1rem',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                  }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)]" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{item.name}: <span className="text-white ml-1">{item.value}</span></span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#161618] p-8 rounded-[2.5rem] border border-white/[0.05] shadow-2xl space-y-8">
          <h3 className="text-xl font-bold serif text-[#c5a059] uppercase tracking-widest">קטגוריות מובילות</h3>
          <div className="h-[300px]">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    contentStyle={{ 
                      backgroundColor: '#111113', 
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '1rem'
                    }}
                  />
                  <Bar dataKey="value" fill="#c5a059" radius={[0, 8, 8, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-neutral-600 italic serif opacity-50">
                אין מספיק נתונים לקטלוג
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#161618] p-10 rounded-[2.5rem] border border-white/[0.05] shadow-xl text-center group">
          <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3 group-hover:text-[#c5a059] transition-colors">דירוג ממוצע</p>
          <div className="text-5xl font-bold serif text-white">
            {library.filter(b => b.rating > 0).length > 0 
              ? (library.reduce((acc, b) => acc + b.rating, 0) / library.filter(b => b.rating > 0).length).toFixed(1)
              : '0.0'}
          </div>
          <div className="flex justify-center mt-3 text-[#c5a059]/30 gap-1">
            {[...Array(5)].map((_, i) => <span key={i} className="text-xl">★</span>)}
          </div>
        </div>
        
        <div className="bg-[#161618] p-10 rounded-[2.5rem] border border-white/[0.05] shadow-xl text-center group">
          <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3 group-hover:text-[#c5a059] transition-colors">אחוז השלמה</p>
          <div className="text-5xl font-bold serif text-white">
            {library.length > 0 ? Math.round((stats.read / library.length) * 100) : 0}%
          </div>
          <p className="text-[10px] text-neutral-600 mt-3 font-bold uppercase tracking-wider">מכלל הספרים בספרייה</p>
        </div>

        <div className="bg-[#161618] p-10 rounded-[2.5rem] border border-white/[0.05] shadow-xl text-center group">
          <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3 group-hover:text-[#c5a059] transition-colors">סה"כ ספרים</p>
          <div className="text-5xl font-bold serif text-white">
            {stats.totalBooks}
          </div>
          <p className="text-[10px] text-neutral-600 mt-3 font-bold uppercase tracking-wider">בכל המדפים יחד</p>
        </div>
      </div>
    </div>
  );
};

export default Stats;
