import { useEffect, useState } from 'react';
import { dbService } from '../services/db';
import { Category, Story, AppSetting } from '../types';
import { Helmet } from 'react-helmet-async';
import StoryCard from '../components/StoryCard';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, Star } from 'lucide-react';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentStories, setRecentStories] = useState<Story[]>([]);
  const [heroSettings, setHeroSettings] = useState<AppSetting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [cats, stories, hero] = await Promise.all([
        dbService.getCategories(),
        dbService.getStories('published', undefined, 10),
        dbService.getSetting('hero')
      ]);
      setCategories(cats);
      setRecentStories(stories);
      setHeroSettings(hero);
      setLoading(false);
    }
    loadData();
  }, []);

  const heroImage = heroSettings?.payload || 'https://placehold.co/1200x500/a78bfa/ffffff?text=Welcome+to+KIDS+STORY+HUB';

  if (loading) {
    return <div className="animate-pulse space-y-8 px-4 mt-8">
      <div className="h-40 bg-white/50 dark:bg-slate-800/50 rounded-[2.5rem] w-full shadow-sm border border-violet-100 dark:border-slate-800"></div>
      <div className="h-64 md:h-[400px] bg-white/50 dark:bg-slate-800/50 rounded-[2.5rem] w-full shadow-sm border border-violet-100 dark:border-slate-800"></div>
    </div>;
  }

  // Pre-defined fun colors for category bubbles
  const catColors = [
    'from-pink-400 to-rose-400',
    'from-amber-400 to-orange-400',
    'from-emerald-400 to-teal-400',
    'from-cyan-400 to-blue-500',
    'from-violet-400 to-fuchsia-500',
  ];

  return (
    <div className="space-y-12 pb-12 mt-4 px-2">
      <Helmet>
        <title>KIDS STORY HUB - Kids Story Platform</title>
        <meta name="description" content="Discover magical stories in English, Hindi, and Bangla for kids." />
      </Helmet>

      {/* Fun Categories at the top! */}
      <section>
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 flex items-center gap-2">
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-amber-400" /> Explore Worlds
          </h2>
          <Link to="/categories" className="text-fuchsia-600 dark:text-fuchsia-400 font-bold flex items-center hover:underline bg-fuchsia-50 dark:bg-fuchsia-900/20 px-4 py-2 rounded-full transition-colors text-sm">
            All <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        {/* Horizontal scrollable categories */}
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2 px-2 snap-x snap-mandatory hide-scrollbar">
          {categories.map((cat, index) => {
            const colorClass = catColors[index % catColors.length];
            return (
              <Link key={cat.id} to={`/categories/${cat.slug}`} className="snap-start shrink-0">
                <motion.div 
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-32 md:w-40 aspect-square rounded-[2.5rem] bg-gradient-to-br ${colorClass} p-1 shadow-lg shadow-violet-500/10 cursor-pointer overflow-hidden group`}
                >
                  <div className="w-full h-full bg-white/20 backdrop-blur-md rounded-[2.2rem] p-3 flex flex-col items-center justify-center text-center gap-2 border border-white/40 group-hover:bg-white/10 transition-colors">
                    {cat.imageUrl ? (
                      <img src={cat.imageUrl} alt={cat.name} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-white shadow-sm" />
                    ) : (
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/50 flex items-center justify-center text-2xl">✨</div>
                    )}
                    <span className="font-extrabold text-white text-sm md:text-base leading-tight drop-shadow-md">{cat.name}</span>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative rounded-[3rem] overflow-hidden shadow-2xl shadow-violet-500/20 aspect-[4/3] sm:aspect-[2/1] md:aspect-[2.5/1] bg-slate-900 border-4 border-white/50 dark:border-slate-800 group">
        <img 
          src={heroImage}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex items-end p-8 md:p-14">
          <div className="max-w-3xl">
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" /> Magic Awaits
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-fuchsia-400 mb-6 leading-tight drop-shadow-lg">
              Embark on Magical Adventures ✨
            </h1>
            <p className="text-white/90 md:text-2xl font-medium mb-8 drop-shadow-md max-w-2xl">
              Discover handpicked tales for young minds in English, Hindi & Bangla.
            </p>
            <Link to="/categories" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-violet-700 bg-white rounded-full hover:bg-amber-100 hover:text-fuchsia-600 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.4)]">
              Start Reading 🚀
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Stories */}
      <section className="pt-8">
        <div className="mb-8 px-2">
          <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 drop-shadow-sm">New Stories 📚</h2>
          <p className="text-violet-600/70 dark:text-violet-300 font-bold mt-2 text-lg">Fresh tales added recently to our magical library.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {recentStories.map(story => {
            const cat = categories.find(c => c.id === story.categoryId);
            return <StoryCard key={story.id} story={story} categoryName={cat?.name} />;
          })}
        </div>
      </section>
    </div>
  );
}
