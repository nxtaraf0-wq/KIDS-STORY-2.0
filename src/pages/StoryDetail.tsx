import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dbService } from '../services/db';
import { Story } from '../types';
import { Helmet } from 'react-helmet-async';
import Markdown from 'react-markdown';
import { Bookmark, Clock, Eye, ChevronLeft, Type, PlayCircle, PauseCircle, StopCircle, Headphones, Sparkles, Heart, Star } from 'lucide-react';
import { useStore } from '../store';
import { motion, useScroll, useSpring } from 'motion/react';

export default function StoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  const { bookmarkedStories, bookmarkStory, unbookmarkStory, fontFamily, speechRate, selectedVoiceURI, setSelectedVoiceURI, likedStories, likeStory, unlikeStory, ratedStories, rateStory } = useStore();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Voice Narrator State
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const updateVoices = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
      if (v.length > 0 && !selectedVoiceURI) {
        // Try to pick a decent initial voice based on story language if possible
        const defaultVoice = v.find(voice => voice.name.toLowerCase().includes('google') || voice.name.toLowerCase().includes('natural')) || v[0];
        setSelectedVoiceURI(defaultVoice.voiceURI);
      }
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    return () => window.speechSynthesis.cancel();
  }, [selectedVoiceURI, setSelectedVoiceURI]);

  const playStory = () => {
    window.speechSynthesis.cancel();
    if (!story) return;
    const cleanText = story.content.replace(/[#*`~\[\]]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voice = voices.find(v => v.voiceURI === selectedVoiceURI);
    if (voice) utterance.voice = voice;
    utterance.rate = speechRate || 1;
    
    utterance.onend = () => { setIsPlaying(false); setIsPaused(false); };
    utterance.onerror = () => { setIsPlaying(false); setIsPaused(false); };
    
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const togglePause = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const stopStory = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      const fetched = await dbService.getStoryBySlug(slug);
      if (fetched) {
        setStory(fetched);
        dbService.incrementStoryViews(fetched);
      }
      setLoading(false);
    }
    loadData();
  }, [slug]);

  if (loading) {
     return <div className="animate-pulse space-y-6 max-w-4xl mx-auto">
       <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl w-full"></div>
       <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl w-3/4"></div>
       <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
     </div>;
  }

  if (!story) {
    return <div className="text-center py-20">Story not found</div>;
  }

  const isBookmarked = bookmarkedStories.includes(story.id);

  const toggleBookmark = () => {
    if (isBookmarked) unbookmarkStory(story.id);
    else bookmarkStory(story.id);
  };

  const fontClasses = {
    normal: 'text-base md:text-lg',
    large: 'text-lg md:text-xl',
    xlarge: 'text-xl md:text-2xl',
  };

  return (
    <article className="max-w-4xl mx-auto pb-16">
      <Helmet>
        <title>{story.metaTitle || story.title} - KIDS STORY HUB</title>
        <meta name="description" content={story.metaDescription || "Read this amazing story."} />
        {story.keywords && <meta name="keywords" content={story.keywords} />}
        <meta property="og:image" content={story.bannerUrl || 'https://placehold.co/1200x630'} />
      </Helmet>

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-400 z-50 origin-left"
        style={{ scaleX }}
      />

      <Link to="/" className="inline-flex items-center text-sm font-bold text-violet-600 hover:text-fuchsia-600 mb-6 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all">
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to stories
      </Link>

      <div className="relative rounded-[2.5rem] overflow-hidden aspect-[2/1] md:aspect-[2.5/1] bg-slate-100 dark:bg-slate-800 xl:shadow-2xl shadow-violet-500/20 mb-10 border-4 border-white dark:border-slate-800">
        <img 
          src={story.bannerUrl || 'https://placehold.co/1200x600/FFB6C1/000000'}
          alt={story.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-6 right-6 flex gap-3">
          <span className="px-4 py-2 text-sm font-bold bg-white/95 dark:bg-slate-900/95 text-violet-600 rounded-xl backdrop-blur-sm shadow-md capitalize">
            {story.language}
          </span>
          <span className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-xl shadow-md capitalize">
            {story.theme}
          </span>
        </div>
      </div>

      <div className="px-4 md:px-8 lg:px-12 bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[2.5rem] pt-10 pb-16 shadow-xl shadow-violet-500/5 border border-white dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b-2 border-violet-100 dark:border-slate-800">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500 leading-tight mb-6 tracking-tight drop-shadow-sm">
              {story.title}
            </h1>
            <div className="flex items-center gap-4 text-sm font-bold text-violet-500 dark:text-violet-400">
              <div className="flex items-center gap-2 bg-violet-50 dark:bg-violet-900/20 px-4 py-2 rounded-xl">
                <Clock className="w-5 h-5" />
                <span>{story.readingTime} min read</span>
              </div>
              <div className="flex items-center gap-2 bg-fuchsia-50 dark:bg-fuchsia-900/20 px-4 py-2 rounded-xl text-fuchsia-500">
                <Eye className="w-5 h-5" />
                <span>{story.views} views</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-sm border border-violet-50 dark:border-slate-700">
            <div className="flex items-center gap-1">
              <button onClick={() => setFontSize('normal')} className={`p-2.5 rounded-xl transition-all ${fontSize === 'normal' ? 'bg-violet-100 dark:bg-slate-700 shadow-sm text-violet-600' : 'text-slate-400 hover:text-violet-500'}`} aria-label="Normal Font">
                <Type className="w-4 h-4" />
              </button>
              <button onClick={() => setFontSize('large')} className={`p-2.5 rounded-xl transition-all ${fontSize === 'large' ? 'bg-violet-100 dark:bg-slate-700 shadow-sm text-violet-600' : 'text-slate-400 hover:text-violet-500'}`} aria-label="Large Font">
                <Type className="w-5 h-5" />
              </button>
              <button onClick={() => setFontSize('xlarge')} className={`p-2.5 rounded-xl transition-all ${fontSize === 'xlarge' ? 'bg-violet-100 dark:bg-slate-700 shadow-sm text-violet-600' : 'text-slate-400 hover:text-violet-500'}`} aria-label="Extra Large Font">
                <Type className="w-6 h-6" />
              </button>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
            <button 
              onClick={toggleBookmark}
              className={`p-3.5 rounded-xl transition-all ${isBookmarked ? 'bg-amber-100 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400 shadow-inner' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700'}`}
              aria-label="Bookmark"
            >
              <Bookmark className={`w-6 h-6 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Magic Narrator Audio Player */}
        <div className="mb-12 bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-slate-800 dark:to-slate-800/80 rounded-3xl p-6 border-2 border-violet-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Headphones className="w-24 h-24 text-violet-500" />
          </div>
          
          <h3 className="font-extrabold text-lg text-violet-600 dark:text-violet-400 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" /> Magic Narrator (Listen & Read) 🎧
          </h3>
          
          <div className="flex flex-col md:flex-row gap-4 items-center relative z-10">
            <div className="flex-1 w-full bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-700 shadow-inner">
              <select 
                value={selectedVoiceURI} 
                onChange={(e) => setSelectedVoiceURI(e.target.value)}
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-slate-700 dark:text-slate-300 font-bold text-sm cursor-pointer px-2"
              >
                {voices.length > 0 ? (
                  // Limit the list safely, browsers could supply 100+ voices
                  voices.slice(0, 30).map((v, i) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      Voice Model {i+1}: {v.name} ({v.lang})
                    </option>
                  ))
                ) : (
                  <option>Loading Magic Voices...</option>
                )}
              </select>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto justify-center">
              {!isPlaying || isPaused ? (
                <button 
                  onClick={isPlaying ? togglePause : playStory}
                  className="px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:scale-105 active:scale-95 text-white font-bold rounded-2xl shadow-lg flex items-center gap-2 transition-all"
                >
                  <PlayCircle className="w-5 h-5" /> 
                  {isPaused ? "Resume" : "Play Story"}
                </button>
              ) : (
                <button 
                  onClick={togglePause}
                  className="px-6 py-3 bg-amber-500 hover:scale-105 active:scale-95 text-white font-bold rounded-2xl shadow-lg flex items-center gap-2 transition-all"
                >
                  <PauseCircle className="w-5 h-5" /> Pause
                </button>
              )}
              
              {isPlaying && (
                <button 
                  onClick={stopStory}
                  className="px-4 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-bold rounded-2xl transition-all"
                  aria-label="Stop playback"
                >
                  <StopCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className={`prose dark:prose-invert max-w-none ${fontFamily === 'serif' ? 'font-serif' : 'font-sans'} ${fontClasses[fontSize]} leading-loose text-slate-700 dark:text-slate-300
           prose-p:mb-8 prose-p:font-medium
           prose-headings:font-extrabold prose-headings:text-transparent prose-headings:bg-clip-text prose-headings:bg-gradient-to-r prose-headings:from-violet-600 prose-headings:to-fuchsia-600
           prose-img:rounded-3xl prose-img:shadow-xl prose-img:border-4 prose-img:border-white
           prose-a:text-fuchsia-500 hover:prose-a:text-fuchsia-600
           marker:text-fuchsia-400`}>
          <div className="markdown-body">
            <Markdown>{story.content}</Markdown>
          </div>
        </div>

        {/* Interaction section */}
        <div className="mt-12 pt-8 border-t border-violet-100 dark:border-slate-800 flex flex-col items-center gap-6">
          <button
            onClick={() => likedStories.includes(story.id) ? unlikeStory(story.id) : likeStory(story.id)}
            className={`flex items-center gap-2 px-8 py-4 rounded-3xl font-extrabold text-lg transition-all shadow-md group ${
              likedStories.includes(story.id)
                ? 'bg-rose-500 text-white shadow-rose-500/30' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Heart className={`w-6 h-6 ${likedStories.includes(story.id) ? 'fill-current text-white scale-110' : 'text-slate-400 group-hover:text-rose-500 transition-colors'}`} /> 
            {likedStories.includes(story.id) ? 'Liked! ❤️' : 'Like this story'}
          </button>

          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400 capitalize">Rate this story</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => rateStory(story.id, star)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star className={`w-8 h-8 ${
                    star <= (ratedStories[story.id] || 0)
                      ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]' 
                      : 'text-slate-300 dark:text-slate-600 hover:text-amber-300'
                  }`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
