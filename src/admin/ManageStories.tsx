import { useEffect, useState } from 'react';
import { dbService } from '../services/db';
import { Story } from '../types';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

export default function ManageStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStories();
  }, []);

  async function loadStories() {
    setLoading(true);
    const data = await dbService.getStories();
    setStories(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this story?')) return;
    try {
      await deleteDoc(doc(db, 'stories', id));
      setStories(s => s.filter(x => x.id !== id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `stories/${id}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Stories</h1>
        <Link to="/admin/stories/new" className="px-4 py-2 bg-primary text-white font-semibold rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors">
          <Plus className="w-5 h-5" /> Add Story
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
         <div className="overflow-x-auto">
           <table className="w-full text-left text-sm">
             <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-medium">
               <tr>
                 <th className="px-6 py-4">Title</th>
                 <th className="px-6 py-4">Status</th>
                 <th className="px-6 py-4">Views</th>
                 <th className="px-6 py-4">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
               {loading ? (
                 <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
               ) : stories.length === 0 ? (
                 <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No stories found.</td></tr>
               ) : (
                 stories.map(story => (
                   <tr key={story.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                     <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{story.title}</td>
                     <td className="px-6 py-4">
                       <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${story.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                         {story.status}
                       </span>
                     </td>
                     <td className="px-6 py-4 text-slate-500">{story.views}</td>
                     <td className="px-6 py-4 flex gap-3">
                       <Link to={`/admin/stories/edit/${story.id}`} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors"><Edit className="w-4 h-4" /></Link>
                       <button onClick={() => handleDelete(story.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                     </td>
                   </tr>
                 ))
               )}
             </tbody>
           </table>
         </div>
      </div>
    </div>
  );
}
