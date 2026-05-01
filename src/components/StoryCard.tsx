import { Link } from 'react-router-dom';
import { Story } from '../types';
import { motion } from 'motion/react';
import { Clock, Eye } from 'lucide-react';

interface StoryCardProps {
  story: Story;
  categoryName?: string;
}

export default function StoryCard({ story, categoryName }: StoryCardProps) {
  return (
    <Link to={`/story/${story.slug}`}>
      <motion.div 
        whileHover={{ y: -8, scale: 1.02 }}
        className="group flex flex-col h-full bg-white/60 backdrop-blur-xl dark:bg-slate-900/60 rounded-[2rem] overflow-hidden shadow-lg shadow-violet-500/5 hover:shadow-2xl hover:shadow-fuchsia-500/20 transition-all border border-white dark:border-slate-800"
      >
        <div className="relative aspect-[3/2] overflow-hidden bg-slate-100 dark:bg-slate-800 p-2">
          <img 
            src={story.thumbnailUrl || 'https://placehold.co/600x400/87CEFA/000000?text=No+Image'} 
            alt={story.title}
            className="w-full h-full object-cover rounded-[1.5rem] group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute top-5 left-5 flex gap-2">
            <span className="px-3 py-1.5 text-xs font-bold bg-white/95 dark:bg-slate-900/95 text-violet-600 dark:text-violet-400 rounded-xl backdrop-blur-sm shadow-sm capitalize border border-violet-100 dark:border-slate-700">
              {story.language}
            </span>
            {categoryName && (
              <span className="px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-xl shadow-sm">
                {categoryName}
              </span>
            )}
          </div>
        </div>
        <div className="p-6 flex flex-col flex-1">
          <h3 className="font-extrabold text-xl text-slate-800 dark:text-slate-100 mb-2 line-clamp-2 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors">
            {story.title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium line-clamp-2 mb-4 flex-1 leading-relaxed">
            {story.metaDescription || "A wonderful story waiting to be read."}
          </p>
          <div className="flex items-center justify-between text-xs font-bold text-violet-500 dark:text-violet-400 mt-auto pt-4 border-t border-violet-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 bg-violet-50 dark:bg-violet-900/20 px-3 py-1.5 rounded-lg">
              <Clock className="w-4 h-4" />
              <span>{story.readingTime} min read</span>
            </div>
            <div className="flex items-center gap-1.5 bg-fuchsia-50 dark:bg-fuchsia-900/20 px-3 py-1.5 rounded-lg text-fuchsia-500">
              <Eye className="w-4 h-4" />
              <span>{story.views} views</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
