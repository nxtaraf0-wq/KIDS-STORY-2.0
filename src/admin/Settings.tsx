import { useEffect, useState } from 'react';
import { dbService } from '../services/db';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function Settings() {
  const [heroImage, setHeroImage] = useState('');
  const [adsCode, setAdsCode] = useState('');
  const [adClient, setAdClient] = useState('');
  const [adSlot, setAdSlot] = useState('');
  const [socialLinks, setSocialLinks] = useState({ youtube: '', instagram: '', facebook: '' });
  const [saving, setSaving] = useState(false);

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

         <div className="flex justify-end">
           <button type="submit" disabled={saving} className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30 disabled:opacity-50">
             {saving ? 'Saving...' : 'Save Settings'}
           </button>
         </div>
      </form>
    </div>
  );
}
