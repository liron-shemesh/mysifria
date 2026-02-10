
import React from 'react';
import { BookOpen, CheckCircle, Clock, XCircle, Home, Search, Library, BarChart3 } from 'lucide-react';

export const COLORS = {
  bg: '#0a0a0b',
  card: '#161618',
  gold: '#c5a059',
  goldLight: '#eaddca',
  text: '#e2e2e2',
  textMuted: '#888888'
};

export const SHELF_LABELS: Record<string, string> = {
  'reading': 'קורא עכשיו',
  'read': 'קראתי',
  'want-to-read': 'רוצה לקרוא',
  'abandoned': 'נטשתי'
};

export const NAVIGATION = [
  { id: 'home', label: 'דף הבית', icon: <Home size={20} />, path: '/' },
  { id: 'search', label: 'חיפוש ספרים', icon: <Search size={20} />, path: '/search' },
  { id: 'shelves', label: 'הספרייה שלי', icon: <Library size={20} />, path: '/shelves' },
  { id: 'stats', label: 'סטטיסטיקות', icon: <BarChart3 size={20} />, path: '/stats' },
];
