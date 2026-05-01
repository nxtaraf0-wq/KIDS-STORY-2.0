import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white/60 backdrop-blur-lg dark:bg-slate-900/60 border-t border-violet-100 dark:border-slate-800 transition-colors mt-auto py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="font-extrabold text-2xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">KIDS STORY HUB</h3>
            <p className="text-slate-600 font-medium dark:text-slate-400 max-w-sm leading-relaxed">
              A magical place for kids to read and explore stories in English, Hindi, and Bangla. Nourishing young minds with beautiful tales. 🌟
            </p>
          </div>
          <div>
            <h4 className="font-extrabold text-violet-800 dark:text-violet-300 mb-4 tracking-wide">Quick Links</h4>
            <ul className="space-y-3 font-medium">
              <li><Link to="/" className="text-slate-600 hover:text-fuchsia-600 dark:text-slate-400 dark:hover:text-fuchsia-400 transition-colors">Home</Link></li>
              <li><Link to="/categories" className="text-slate-600 hover:text-fuchsia-600 dark:text-slate-400 dark:hover:text-fuchsia-400 transition-colors">All Categories</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-extrabold text-violet-800 dark:text-violet-300 mb-4 tracking-wide">Legal</h4>
            <ul className="space-y-3 font-medium">
              <li><Link to="/privacy" className="text-slate-600 hover:text-fuchsia-600 dark:text-slate-400 dark:hover:text-fuchsia-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-slate-600 hover:text-fuchsia-600 dark:text-slate-400 dark:hover:text-fuchsia-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-violet-100 dark:border-slate-800 text-center text-slate-500 font-extrabold text-xs sm:text-sm uppercase tracking-widest leading-relaxed">
          &copy; {new Date().getFullYear()} KIDS STORY HUB. PROUDLY CREATED BY <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 text-lg mx-1 inline-block transform hover:scale-110 transition-transform">ARAF STUDIO</span> 🚀
        </div>
      </div>
    </footer>
  );
}
