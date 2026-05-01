import { useEffect, useState } from 'react';
import { dbService } from '../services/db';
import { Category } from '../types';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { doc, deleteDoc, setDoc, updateDoc, collection } from 'firebase/firestore';
import { generateSlug } from '../lib/utils';
import { Trash2, Edit } from 'lucide-react';

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCat, setEditingCat] = useState<Partial<Category> | null>(null);
  
  useEffect(() => {
    loadCats();
  }, []);

  async function loadCats() {
    setLoading(true);
    const data = await dbService.getCategories(false);
    setCategories(data);
    setLoading(false);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat || !editingCat.name) return;
    
    try {
      const now = Date.now();
      const catData = {
        name: editingCat.name,
        slug: editingCat.slug || generateSlug(editingCat.name),
        theme: editingCat.theme || 'Default',
        imageUrl: editingCat.imageUrl || '',
        enabled: editingCat.enabled ?? true,
        updatedAt: now,
      };

      if (editingCat.id) {
        await updateDoc(doc(db, 'categories', editingCat.id), catData);
      } else {
        const newId = doc(collection(db, 'categories')).id;
        const createdData = {
          ...catData,
          createdAt: now,
          authorId: auth.currentUser?.uid || ''
        };
        await setDoc(doc(db, 'categories', newId), createdData);
      }
      setEditingCat(null);
      loadCats();
    } catch (err) {
      handleFirestoreError(err, editingCat.id ? OperationType.UPDATE : OperationType.CREATE, `categories`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete category?')) return;
    try {
      await deleteDoc(doc(db, 'categories', id));
      loadCats();
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `categories/${id}`);
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Manage Categories</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold mb-4">{editingCat?.id ? 'Edit' : 'Add'} Category</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input required type="text" className="w-full px-4 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-primary" value={editingCat?.name || ''} onChange={e => setEditingCat({...editingCat, name: e.target.value, slug: generateSlug(e.target.value)})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug *</label>
                <input required type="text" className="w-full px-4 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-primary" value={editingCat?.slug || ''} onChange={e => setEditingCat({...editingCat, slug: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Theme (Default, Kids, Horror, Moral, Royal)</label>
                 <select required className="w-full px-4 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-primary" value={editingCat?.theme || 'Default'} onChange={e => setEditingCat({...editingCat, theme: e.target.value})}>
                   {['Default', 'Kids', 'Horror', 'Moral', 'Royal'].map(t => <option key={t} value={t}>{t}</option>)}
                 </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input type="url" placeholder="https://placehold.co/800x600" className="w-full px-4 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-primary" value={editingCat?.imageUrl || ''} onChange={e => setEditingCat({...editingCat, imageUrl: e.target.value})} />
              </div>
              <div className="flex items-center gap-2">
                 <input type="checkbox" id="enabled" checked={editingCat ? editingCat.enabled !== false : true} onChange={e => setEditingCat({...editingCat, enabled: e.target.checked})} />
                 <label htmlFor="enabled" className="text-sm font-medium">Enabled on frontend</label>
              </div>
              
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">Save</button>
                {editingCat && (
                  <button type="button" onClick={() => setEditingCat(null)} className="flex-1 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Cancel</button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="md:col-span-2">
           <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
             <table className="w-full text-left text-sm">
               <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-medium">
                 <tr>
                   <th className="px-6 py-4">Category</th>
                   <th className="px-6 py-4">Theme</th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                 {loading ? <tr><td colSpan={4} className="p-6 text-center text-slate-500">Loading...</td></tr> : 
                   categories.map(cat => (
                     <tr key={cat.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                       <td className="px-6 py-4 font-medium flex items-center gap-3">
                         {cat.imageUrl && <img src={cat.imageUrl} className="w-10 h-10 rounded object-cover" alt="" />}
                         {cat.name}
                       </td>
                       <td className="px-6 py-4">{cat.theme}</td>
                       <td className="px-6 py-4">
                         <span className={`px-2 py-1 rounded text-xs font-semibold ${cat.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{cat.enabled ? 'Enabled' : 'Disabled'}</span>
                       </td>
                       <td className="px-6 py-4 flex justify-end gap-2">
                         <button onClick={() => setEditingCat(cat)} className="text-blue-600 p-1.5 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                         <button onClick={() => handleDelete(cat.id)} className="text-red-600 p-1.5 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                       </td>
                     </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
}
