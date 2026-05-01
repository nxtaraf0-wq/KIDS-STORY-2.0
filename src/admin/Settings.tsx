import { useEffect, useState } from 'react';
import { dbService } from '../services/db';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';

export default function Settings() {
  const [heroImage, setHeroImage] = useState('');
  const [adsCode, setAdsCode] = useState('');
  const [adClient, setAdClient] = useState('');
  const [adSlot, setAdSlot] = useState('');
  const [socialLinks, setSocialLinks] = useState({ youtube: '', instagram: '', facebook: '' });
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const handleSeedData = async () => {
    if (!confirm('This will add 10 categories and 20 stories. Are you sure?')) return;
    setSeeding(true);
    try {
      const now = Date.now();
      const authorId = auth.currentUser?.uid || 'system';
      
      const categories = [
        { name: 'Bedtime Stories', slug: 'bedtime-stories', theme: 'purple', imageUrl: 'https://images.unsplash.com/photo-1544256718-3b6102360b61?auto=format&fit=crop&q=80&w=800' },
        { name: 'Animal Tales', slug: 'animal-tales', theme: 'amber', imageUrl: 'https://images.unsplash.com/photo-1560730415-9c98834927b2?auto=format&fit=crop&q=80&w=800' },
        { name: 'Sci-Fi Adventures', slug: 'sci-fi-adventures', theme: 'blue', imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800' },
        { name: 'Fairy Tales', slug: 'fairy-tales', theme: 'pink', imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800' },
        { name: 'Mystery Solvers', slug: 'mystery-solvers', theme: 'slate', imageUrl: 'https://images.unsplash.com/photo-1542456424-9b932be0f5da?auto=format&fit=crop&q=80&w=800' },
        { name: 'Superhero Legends', slug: 'superhero-legends', theme: 'red', imageUrl: 'https://images.unsplash.com/photo-1620336655055-088d06e36bf0?auto=format&fit=crop&q=80&w=800' },
        { name: 'Funny Stories', slug: 'funny-stories', theme: 'yellow', imageUrl: 'https://images.unsplash.com/photo-1545041188-46aaacfdadbb?auto=format&fit=crop&q=80&w=800' },
        { name: 'Space Explorers', slug: 'space-explorers', theme: 'indigo', imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800' },
        { name: 'Ocean Wonders', slug: 'ocean-wonders', theme: 'cyan', imageUrl: 'https://images.unsplash.com/photo-1518467166778-b88f373ff25?auto=format&fit=crop&q=80&w=800' },
        { name: 'Magic & Wizards', slug: 'magic-wizards', theme: 'violet', imageUrl: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&q=80&w=800' },
      ];

      const categoryIds: string[] = [];
      
      for (const cat of categories) {
        const docRef = await addDoc(collection(db, 'categories'), {
          ...cat,
          enabled: true,
          createdAt: now,
          updatedAt: now,
          authorId
        });
        categoryIds.push(docRef.id);
      }

      for (let i = 1; i <= 20; i++) {
        const catId = categoryIds[i % categoryIds.length];
        const catTheme = categories[i % categories.length].theme;
        
        await addDoc(collection(db, 'stories'), {
          title: `Amazing Story ${i}`,
          slug: `amazing-story-${i}-${Date.now()}`,
          categoryId: catId,
          theme: catTheme || 'violet',
          language: 'en-US',
          bannerUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1200',
          thumbnailUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
          content: `This is the awesome content of amazing story ${i}. Once upon a time, there was a great adventure waiting to happen. The heroes traveled far and wide across the magnificent landscapes. They encountered challenges, but with teamwork and bravery, they overcame them all. The end.`,
          metaTitle: `Amazing Story ${i} - A beautiful kids story`,
          metaDescription: `Read about the amazing adventures in story ${i}.`,
          keywords: 'story, kids, fun',
          readingTime: 3,
          views: Math.floor(Math.random() * 1000),
          published: true,
          createdAt: now - (i * 100000),
          updatedAt: now,
          authorId
        });
      }

      alert('Successfully seeded 10 categories and 20 stories!');
    } catch (e) {
      console.error(e);
      alert('Error seeding data. Admin access required.');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    async function load() {
      const [hero, ads, social, adsUnit] = await Promise.all([
        dbService.getSetting('hero'),
        dbService.getSetting('ads'),
        dbService.getSetting('social'),
        dbService.getSetting('ads_unit'),
      ]);
      if (hero) setHeroImage(hero.payload);
      if (ads) setAdsCode(ads.payload);
      
      if (social) {
        try {
          const s = JSON.parse(social.payload);
          setSocialLinks(s);
        } catch(e) {}
      }
      
      if (adsUnit) {
        try {
          const config = JSON.parse(adsUnit.payload);
          setAdClient(config.client || '');
          setAdSlot(config.slot || '');
        } catch(e) {}
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const now = Date.now();
    try {
      await Promise.all([
        setDoc(doc(db, 'settings', 'hero'), { type: 'string', payload: heroImage, updatedAt: now }),
        setDoc(doc(db, 'settings', 'ads'), { type: 'string', payload: adsCode, updatedAt: now }),
        setDoc(doc(db, 'settings', 'social'), { type: 'json', payload: JSON.stringify(socialLinks), updatedAt: now }),
        setDoc(doc(db, 'settings', 'ads_unit'), { type: 'json', payload: JSON.stringify({ client: adClient, slot: adSlot }), updatedAt: now })
      ]);
      alert('Settings saved!');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Site Settings</h1>

      <form onSubmit={handleSave} className="space-y-8">
         <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
           <h2 className="text-xl font-bold mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">Homepage Appearance</h2>
           <div className="space-y-4">
             <label className="block text-sm font-medium mb-1">Hero Image URL</label>
             <p className="text-xs text-slate-500 mb-2">Recommended size: 1200x500. Format: JPG/PNG.</p>
             <input type="url" className="w-full px-4 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-primary mb-4" value={heroImage} onChange={e => setHeroImage(e.target.value)} />
             
             {heroImage && (
               <div className="rounded-xl overflow-hidden aspect-[3/1] bg-slate-100">
                 <img src={heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
               </div>
             )}
           </div>
         </div>

         <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
           <h2 className="text-xl font-bold mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">Social Media Links</h2>
           <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">YouTube URL</label>
                <input type="url" className="w-full px-4 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-primary" value={socialLinks.youtube} onChange={e => setSocialLinks({...socialLinks, youtube: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Instagram URL</label>
                <input type="url" className="w-full px-4 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-primary" value={socialLinks.instagram} onChange={e => setSocialLinks({...socialLinks, instagram: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Facebook URL</label>
                <input type="url" className="w-full px-4 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-primary" value={socialLinks.facebook} onChange={e => setSocialLinks({...socialLinks, facebook: e.target.value})} />
              </div>
           </div>
         </div>

         <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
           <h2 className="text-xl font-bold mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">Monetization (AdSense)</h2>
           <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium mb-1">AdSense Publisher ID (Client ID)</label>
               <input type="text" placeholder="ca-pub-xxxxxxxxxxxxxxxx" className="w-full px-4 py-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-primary font-mono text-sm" value={adClient} onChange={e => setAdClient(e.target.value)} />
             </div>
             <div>
               <label className="block text-sm font-medium mb-1">AdSense Slot ID</label>
               <input type="text" placeholder="xxxxxxxxxx" className="w-full px-4 py-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-primary font-mono text-sm" value={adSlot} onChange={e => setAdSlot(e.target.value)} />
               <p className="text-xs text-slate-500 mt-2">These fields will display AdSense banner ads within the content (e.g. at the bottom of stories).</p>
             </div>
             
             <div className="pt-4 border-t border-slate-100 dark:border-slate-700 mt-4">
               <label className="block text-sm font-medium mb-1">AdSense Global Header Code (Optional)</label>
               <p className="text-xs text-slate-500 mb-2">Use this for Auto Ads setup if you prefer. Paste the tracking snippet here.</p>
               <textarea rows={4} className="w-full px-4 py-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-primary font-mono text-sm" value={adsCode} onChange={e => setAdsCode(e.target.value)} />
             </div>
           </div>
         </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">Seed Data</h2>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-sm text-slate-500 mb-0">Generate 10 categories and 20 sample stories for testing.</p>
              </div>
              <button
                type="button"
                onClick={handleSeedData}
                disabled={seeding}
                className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                {seeding ? 'Seeding...' : 'Seed Data'}
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={saving} className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
    </div>
  );
}
