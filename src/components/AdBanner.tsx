import { useEffect, useState } from 'react';
import { dbService } from '../services/db';

export default function AdBanner() {
  const [adConfig, setAdConfig] = useState<{ client: string; slot: string } | null>(null);

  useEffect(() => {
    async function load() {
      const ads = await dbService.getSetting('ads_unit');
      if (ads && ads.payload) {
        try {
          const config = JSON.parse(ads.payload);
          if (config.client && config.slot) {
            setAdConfig(config);
          }
        } catch (e) {
          console.error("Failed to parse ad config:", e);
        }
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (adConfig) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("Adsbygoogle push error:", e);
      }
    }
  }, [adConfig]);

  if (!adConfig) {
    return null;
  }

  return (
    <div className="w-full my-8 flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700">
      <div className="text-center w-full overflow-hidden">
        <span className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-2 block">Advertisement</span>
        <ins
          className="adsbygoogle block w-full bg-slate-50 dark:bg-slate-900 mx-auto"
          style={{ minWidth: '250px', minHeight: '90px' }}
          data-ad-client={adConfig.client}
          data-ad-slot={adConfig.slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
