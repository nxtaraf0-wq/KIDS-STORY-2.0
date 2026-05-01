import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Story } from '../types';
import StoryCard from '../components/StoryCard';
import AdBanner from '../components/AdBanner';
import { Sparkles, Frown } from 'lucide-react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';

export default function NewArrivals() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'stories'), 
          where('published', '==', true),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
        const fbDocs = await getDocs(q);
        
        const results = fbDocs.docs.map(d => ({ id: d.id, ...d.data() } as Story));
        setStories(results);
      } catch (e) {
        console.error("Load error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Helmet>
        <title>New Arrivals - KIDS STORY HUB</title>
      </Helmet>

      <div className="mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 mb-4 flex items-center gap-4">
          <Sparkles className="w-10 h-10 text-violet-500" />
          New Arrivals
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">
          Fresh new stories from our authors!
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
        </div>
      ) : stories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <StoryCard story={story} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-violet-100 dark:border-slate-700">
          <Frown className="w-20 h-20 mx-auto text-slate-300 dark:text-slate-600 mb-6" />
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">No stories found</h2>
          <p className="text-slate-500 max-w-md mx-auto">Check back later for new stories.</p>
        </div>
      )}

      <AdBanner />
    </div>
  );
}
