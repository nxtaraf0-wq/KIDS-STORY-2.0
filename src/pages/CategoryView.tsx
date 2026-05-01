import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dbService } from '../services/db';
import { Category, Story } from '../types';
import { Helmet } from 'react-helmet-async';
import StoryCard from '../components/StoryCard';

export default function CategoryView() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      const cat = await dbService.getCategoryBySlug(slug);
      setCategory(cat);
      if (cat) {
        const catStories = await dbService.getStories('published', cat.id, 100);
        setStories(catStories);
      }
      setLoading(false);
    }
    loadData();
  }, [slug]);

  if (loading) {
    return <div className="animate-pulse h-96 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>;
  }

  // If no slug, just list categories (mocking the /categories route as well if we don't build it separately)
  if (!category && slug) {
    return (
      <div className="text-center py-20 text-slate-500">
        <h2 className="text-2xl font-bold mb-4">Category not found</h2>
        <Link to="/" className="text-primary hover:underline">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {category && (
        <Helmet>
          <title>{category.name} Stories - KIDS STORY HUB</title>
          <meta name="description" content={`Read magical stories from the ${category.name} collection.`} />
        </Helmet>
      )}

      {category && (
        <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/1] bg-slate-900 shadow-2xl shadow-violet-500/20 border-4 border-white/50 dark:border-slate-800">
           <img 
            src={category.imageUrl || 'https://placehold.co/1200x300/a78bfa/ffffff'}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center bg-gradient-to-t from-violet-900/60 to-transparent">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-3 drop-shadow-xl">{category.name}</h1>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-white font-bold capitalize border border-white/30 shadow-md">
                {category.theme} Theme
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map(story => (
          <StoryCard key={story.id} story={story} categoryName={category?.name} />
        ))}
        {stories.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">
            No stories in this category yet.
          </div>
        )}
      </div>
    </div>
  );
}
