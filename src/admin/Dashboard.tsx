import { useEffect, useState } from 'react';
import { dbService } from '../services/db';
import { Story, Category } from '../types';
import { Link } from 'react-router-dom';
import { Book, LayoutGrid, Eye, Plus } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ stories: 0, categories: 0, views: 0 });
  const [recentStories, setRecentStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [stories, cats] = await Promise.all([
        dbService.getStories(),
        dbService.getCategories(false)
      ]);
      const totalViews = stories.reduce((acc, s) => acc + (s.views || 0), 0);
      setStats({ stories: stories.length, categories: cats.length, views: totalViews });
      setRecentStories(stories.slice(0, 5));
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-slate-500">Welcome to KIDS STORY HUB admin panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
             <Book className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Total Stories</div>
            <div className="text-2xl font-bold">{stats.stories}</div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
             <LayoutGrid className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Categories</div>
            <div className="text-2xl font-bold">{stats.categories}</div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
             <Eye className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Total Views</div>
            <div className="text-2xl font-bold">{stats.views}</div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
           <h2 className="text-lg font-bold">Recent Stories</h2>
           <Link to="/admin/stories/new" className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
             <Plus className="w-4 h-4 mr-1" /> Add New
           </Link>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
           {recentStories.map(story => (
             <div key={story.id} className="p-4 px-6 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
               <div>
                 <div className="font-semibold text-slate-800 dark:text-slate-200">{story.title}</div>
                 <div className="text-xs text-slate-500 mt-1 capitalize">{story.status} &bull; {story.views} views</div>
               </div>
               <Link to={`/admin/stories/edit/${story.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-700">Edit</Link>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
