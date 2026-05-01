import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { Moon, Sun, BookOpen, Menu, X, Sparkles, Heart, Star, Compass, Settings as SettingsIcon, Type, Volume2, Headphones, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';

export default function Header() {
  const { isDarkMode, toggleDarkMode, speechRate, setSpeechRate, fontFamily, setFontFamily, selectedVoiceURI, setSelectedVoiceURI } = useStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  useEffect(() => {
    const updateVoices = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
      if (v.length > 0 && !selectedVoiceURI) {
        const defaultVoice = v.find(voice => voice.name.toLowerCase().includes('google') || voice.name.toLowerCase().includes('natural')) || v[0];
        setSelectedVoiceURI(defaultVoice.voiceURI);
      }
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, [selectedVoiceURI, setSelectedVoiceURI]);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setIsAdmin(!!user);
    });
    return unsub;
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-violet-100 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-violet-400 to-fuchsia-500 p-2.5 rounded-2xl shadow-lg shadow-fuchsia-500/30 transform -rotate-6 hover:rotate-6 transition-transform">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">
              KIDS STORY HUB
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6 items-center">
            <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-fuchsia-600 dark:text-slate-300 dark:hover:text-fuchsia-400 transition-colors font-bold">
              <Sparkles className="w-4 h-4" /> Home
            </Link>
            <Link to="/categories" className="flex items-center gap-2 text-slate-600 hover:text-fuchsia-600 dark:text-slate-300 dark:hover:text-fuchsia-400 transition-colors font-bold">
              <Compass className="w-4 h-4" /> Categories
            </Link>
            
            <div className="h-6 w-px bg-violet-200 dark:bg-slate-700 mx-2"></div>
            
            <button 
              onClick={toggleDarkMode}
              className="p-2.5 rounded-2xl hover:bg-violet-100 dark:hover:bg-slate-800 transition-all text-violet-600 dark:text-amber-400"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAdmin && (
               <Link to="/admin" className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 hover:scale-105 text-white text-sm font-bold transition-all shadow-lg">
                 Admin
               </Link>
            )}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-2xl hover:bg-violet-100 dark:hover:bg-slate-800 transition-all text-violet-600 dark:text-amber-400 font-bold flex items-center gap-2"
              title="Search"
            >
              <Search className="w-5 h-5" /> Search
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2.5 rounded-2xl hover:bg-violet-100 dark:hover:bg-slate-800 transition-all text-violet-600 dark:text-amber-400 font-bold flex items-center gap-2"
            >
              <SettingsIcon className="w-5 h-5" /> Menu
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-2xl bg-violet-50 dark:bg-slate-800 text-violet-600 dark:text-violet-400 hover:bg-violet-100 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2.5 rounded-2xl bg-violet-50 dark:bg-slate-800 text-violet-600 dark:text-violet-400 hover:bg-violet-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[80]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-20 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[600px] bg-white dark:bg-slate-900 z-[90] shadow-2xl rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800"
            >
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }
                }}
                className="flex items-center p-2"
              >
                <div className="pl-4 text-slate-400">
                  <Search className="w-6 h-6" />
                </div>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search for amazing stories..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none focus:outline-none px-4 py-4 text-lg font-medium text-slate-700 dark:text-slate-200"
                />
                <button 
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-amber-400 transition-colors bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-2xl mr-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile/Sidebar Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-80 md:w-96 bg-white dark:bg-slate-900 z-[70] shadow-2xl flex flex-col border-l border-violet-100 dark:border-slate-800"
            >
              <div className="p-6 flex items-center justify-between border-b border-violet-100 dark:border-slate-800">
                <span className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">
                  Menu ✨
                </span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-6 space-y-6">
                <div className="space-y-3 md:hidden">
                  <Link to="/" className="flex items-center gap-3 p-4 rounded-2xl bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 font-bold active:scale-95 transition-transform">
                    <Sparkles className="w-5 h-5 text-violet-500" /> Home
                  </Link>
                  <Link to="/categories" className="flex items-center gap-3 p-4 rounded-2xl bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-700 dark:text-fuchsia-300 font-bold active:scale-95 transition-transform">
                    <Compass className="w-5 h-5 text-fuchsia-500" /> All Categories
                  </Link>
                </div>

                <div className="pt-6 border-t border-violet-100 dark:border-slate-800">
                  <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <SettingsIcon className="w-4 h-4" /> Settings
                  </h3>
                  
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-2 border border-slate-100 dark:border-slate-800 mb-4">
                    <button 
                      onClick={toggleDarkMode}
                      className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-colors group"
                    >
                      <span className="font-bold text-slate-700 dark:text-slate-200">Dark Mode</span>
                      <div className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'bg-amber-100 text-amber-500' : 'bg-slate-200 text-slate-500'}`}>
                        {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      </div>
                    </button>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 space-y-3 mb-4">
                    <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-violet-500" /> Voice Speed
                    </span>
                    <div className="flex gap-2 mb-4">
                      {[0.5, 1, 1.5, 2].map(speed => (
                        <button 
                          key={speed}
                          onClick={() => setSpeechRate(speed)}
                          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors ${speechRate === speed ? 'bg-violet-500 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700'}`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 mt-4 mb-2">
                      <Headphones className="w-4 h-4 text-emerald-500" /> Voice Model
                    </span>
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-2 border border-slate-200 dark:border-slate-700 shadow-inner">
                      <select 
                        value={selectedVoiceURI} 
                        onChange={(e) => setSelectedVoiceURI(e.target.value)}
                        className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-slate-700 dark:text-slate-300 font-bold text-sm cursor-pointer p-1"
                      >
                        {voices.length > 0 ? (
                          voices.slice(0, 30).map((v, i) => (
                            <option key={`${v.voiceURI}-${i}`} value={v.voiceURI}>
                              {v.name} ({v.lang})
                            </option>
                          ))
                        ) : (
                          <option>Loading Voices...</option>
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 space-y-3">
                    <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                      <Type className="w-4 h-4 text-fuchsia-500" /> Story Font
                    </span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setFontFamily('sans')}
                        className={`flex-1 py-3 px-2 text-sm font-bold rounded-xl transition-all ${fontFamily === 'sans' ? 'bg-fuchsia-500 text-white shadow-md font-sans' : 'bg-white dark:bg-slate-900 text-slate-500 shadow-sm border border-slate-100 dark:border-slate-700 font-sans'}`}
                      >
                        Modern
                      </button>
                      <button 
                        onClick={() => setFontFamily('serif')}
                        className={`flex-1 py-3 px-2 text-sm font-bold rounded-xl transition-all ${fontFamily === 'serif' ? 'bg-amber-500 text-white shadow-md font-serif' : 'bg-white dark:bg-slate-900 text-slate-500 shadow-sm border border-slate-100 dark:border-slate-700 font-serif'}`}
                      >
                        Classic
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-violet-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                {isAdmin && (
                  <Link to="/admin" className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors">
                    Admin Dashboard
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
