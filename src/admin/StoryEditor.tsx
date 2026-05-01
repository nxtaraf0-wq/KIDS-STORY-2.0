import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dbService } from '../services/db';
import { Story, Category } from '../types';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { generateSlug } from '../lib/utils';
import { ChevronLeft } from 'lucide-react';

export default function StoryEditor() {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [story, setStory] = useState<Partial<Story>>({
    title: '', slug: '', categoryId: '', theme: 'Default', language: 'English',
    bannerUrl: '', thumbnailUrl: '', content: '', metaTitle: '', metaDescription: '',
    keywords: '', readingTime: 5, status: 'draft'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const cats = await dbService.getCategories();
      setCategories(cats);
      if (id) {
        const existing = await dbService.getStoryBySlug(id); // wait, edit uses ID not slug
        // actually id in url is document ID!
        // oops, need a getStoryById?
      }
    }
    load();
  }, [id]);

  // Quick fix for edit: we need getStoryById
  useEffect(() => {
    if (!id) return;
    const loadStory = async () => {
      // For now we get from all stories, or add getStoryById to dbService
      const all = await dbService.getStories();
      const s = all.find(x => x.id === id);
      if (s) setStory(s);
    }
    loadStory();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const now = Date.now();
      const sData = {
        title: story.title || '',
        slug: story.slug || generateSlug(story.title || ''),
        categoryId: story.categoryId || (categories[0]?.id || ''),
        theme: categories.find(c => c.id === story.categoryId)?.theme || 'Default',
        language: story.language || 'English',
        bannerUrl: story.bannerUrl || '',
        thumbnailUrl: story.thumbnailUrl || '',
        content: story.content || '',
        metaTitle: story.metaTitle || '',
        metaDescription: story.metaDescription || '',
        keywords: story.keywords || '',
        readingTime: Number(story.readingTime || 5),
        status: story.status || 'draft',
        updatedAt: now,
      };

      if (id) {
        await updateDoc(doc(db, 'stories', id), sData);
      } else {
        const newId = sData.slug; // use slug as id for simplicity or doc() for random
        const createdData = {
          ...sData,
          views: 0,
          createdAt: now,
          authorId: auth.currentUser?.uid || ''
        };
        await setDoc(doc(db, 'stories', newId), createdData);
      }
      navigate('/admin/stories');
    } catch (err) {
      handleFirestoreError(err, id ? OperationType.UPDATE : OperationType.CREATE, `stories`);
      alert("Error saving: " + String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm p-8 border border-slate-200 dark:border-slate-700">
        <h1 className="text-2xl font-bold mb-6">{id ? 'Edit Story' : 'New Story'}</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium">Title *</label>
              <input required type="text" className="w-full px-4 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-primary" value={story.title} onChange={e => setStory({...story, title: e.target.value, slug: generateSlug(e.target.value)})} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Slug *</label>
              <input required type="text" className="w-full px-4 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-primary" value={story.slug} onChange={e => setStory({...story, slug: e.target.value})} />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Category *</label>
              <select required className="w-full px-4 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-primary" value={story.categoryId} onChange={e => setStory({...story, categoryId: e.target.value})}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
             <div className="space-y-1">
              <label className="text-sm font-medium">Language *</label>
              <select required className="w-full px-4 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-primary" value={story.language} onChange={e => setStory({...story, language: e.target.value})}>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Bangla">Bangla</option>
                <option value="Earth All Language">Earth All Language</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Banner Image URL</label>
              <input type="url" placeholder="https://placehold.co/1200x600" className="w-full px-4 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-primary" value={story.bannerUrl} onChange={e => setStory({...story, bannerUrl: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Thumbnail Image URL</label>
              <input type="url" placeholder="https://placehold.co/600x400" className="w-full px-4 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-primary" value={story.thumbnailUrl} onChange={e => setStory({...story, thumbnailUrl: e.target.value})} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Story Content (Markdown supported) *</label>
            <textarea required rows={10} className="w-full px-4 py-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-primary font-mono text-sm" value={story.content} onChange={e => setStory({...story, content: e.target.value})} />
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <h3 className="font-semibold mb-4 text-lg">SEO & Meta Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-1">
                 <label className="text-sm font-medium">Meta Title</label>
                 <input type="text" className="w-full px-4 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-primary" value={story.metaTitle} onChange={e => setStory({...story, metaTitle: e.target.value})} />
               </div>
               <div className="space-y-1">
                 <label className="text-sm font-medium">Keywords</label>
                 <input type="text" placeholder="kids, story, magic" className="w-full px-4 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-primary" value={story.keywords} onChange={e => setStory({...story, keywords: e.target.value})} />
               </div>
               <div className="col-span-1 md:col-span-2 space-y-1">
                 <label className="text-sm font-medium">Meta Description</label>
                 <input type="text" className="w-full px-4 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-primary" value={story.metaDescription} onChange={e => setStory({...story, metaDescription: e.target.value})} />
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-200 dark:border-slate-700 pt-6">
             <div className="space-y-1">
                 <label className="text-sm font-medium">Status</label>
                 <select className="w-full px-4 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-primary" value={story.status} onChange={e => setStory({...story, status: e.target.value as any})}>
                   <option value="draft">Draft</option>
                   <option value="published">Published</option>
                 </select>
               </div>
               <div className="space-y-1">
                 <label className="text-sm font-medium">Reading Time (minutes)</label>
                 <input type="number" min={1} className="w-full px-4 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-primary" value={story.readingTime} onChange={e => setStory({...story, readingTime: parseInt(e.target.value)})} />
               </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-8 py-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Story'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
