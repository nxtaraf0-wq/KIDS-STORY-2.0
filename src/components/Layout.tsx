import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useStore } from '../store';
import { useEffect, useState } from 'react';
import { dbService } from '../services/db';

export default function Layout() {
  const { isDarkMode } = useStore();
  const [adsCode, setAdsCode] = useState('');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    async function loadAds() {
      const ads = await dbService.getSetting('ads');
      if (ads && ads.payload) {
        setAdsCode(ads.payload);
      }
    }
    loadAds();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-50 via-fuchsia-50 to-cyan-50 dark:from-slate-950 dark:via-pink-950/20 dark:to-slate-950 text-slate-900 dark:text-slate-50 font-sans transition-colors duration-200">
      {adsCode && <div dangerouslySetInnerHTML={{ __html: adsCode }} />}
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
