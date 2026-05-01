import { create } from 'zustand';

interface UserPreferences {
  isDarkMode: boolean;
  bookmarkedStories: string[];
  readingProgress: Record<string, number>;
  speechRate: number;
  fontFamily: string;
  selectedVoiceURI: string;
  vfxEnabled: boolean;
  bgmEnabled: boolean;
  likedStories: string[];
  ratedStories: Record<string, number>;
  toggleDarkMode: () => void;
  bookmarkStory: (storyId: string) => void;
  unbookmarkStory: (storyId: string) => void;
  updateReadingProgress: (storyId: string, progress: number) => void;
  setSpeechRate: (rate: number) => void;
  setFontFamily: (font: string) => void;
  setSelectedVoiceURI: (uri: string) => void;
  setVfxEnabled: (enabled: boolean) => void;
  setBgmEnabled: (enabled: boolean) => void;
  likeStory: (storyId: string) => void;
  unlikeStory: (storyId: string) => void;
  rateStory: (storyId: string, rating: number) => void;
}

export const useStore = create<UserPreferences>((set) => ({
  isDarkMode: JSON.parse(localStorage.getItem('isDarkMode') || 'false'),
  bookmarkedStories: JSON.parse(localStorage.getItem('bookmarkedStories') || '[]'),
  readingProgress: JSON.parse(localStorage.getItem('readingProgress') || '{}'),
  speechRate: JSON.parse(localStorage.getItem('speechRate') || '1'),
  fontFamily: localStorage.getItem('fontFamily') || 'sans',
  selectedVoiceURI: localStorage.getItem('selectedVoiceURI') || '',
  vfxEnabled: JSON.parse(localStorage.getItem('vfxEnabled') || 'true'),
  bgmEnabled: JSON.parse(localStorage.getItem('bgmEnabled') || 'true'),
  likedStories: JSON.parse(localStorage.getItem('likedStories') || '[]'),
  ratedStories: JSON.parse(localStorage.getItem('ratedStories') || '{}'),
  
  toggleDarkMode: () => set((state) => {
    const newState = !state.isDarkMode;
    localStorage.setItem('isDarkMode', JSON.stringify(newState));
    return { isDarkMode: newState };
  }),
  
  bookmarkStory: (storyId) => set((state) => {
    const newBookmarks = [...new Set([...state.bookmarkedStories, storyId])];
    localStorage.setItem('bookmarkedStories', JSON.stringify(newBookmarks));
    return { bookmarkedStories: newBookmarks };
  }),
  
  unbookmarkStory: (storyId) => set((state) => {
    const newBookmarks = state.bookmarkedStories.filter(id => id !== storyId);
    localStorage.setItem('bookmarkedStories', JSON.stringify(newBookmarks));
    return { bookmarkedStories: newBookmarks };
  }),
  
  updateReadingProgress: (storyId, progress) => set((state) => {
    const newProgress = { ...state.readingProgress, [storyId]: progress };
    localStorage.setItem('readingProgress', JSON.stringify(newProgress));
    return { readingProgress: newProgress };
  }),

  setSpeechRate: (rate) => set(() => {
    localStorage.setItem('speechRate', JSON.stringify(rate));
    return { speechRate: rate };
  }),

  setFontFamily: (font) => set(() => {
    localStorage.setItem('fontFamily', font);
    return { fontFamily: font };
  }),

  setSelectedVoiceURI: (uri) => set(() => {
    localStorage.setItem('selectedVoiceURI', uri);
    return { selectedVoiceURI: uri };
  }),

  setVfxEnabled: (enabled) => set(() => {
    localStorage.setItem('vfxEnabled', JSON.stringify(enabled));
    return { vfxEnabled: enabled };
  }),

  setBgmEnabled: (enabled) => set(() => {
    localStorage.setItem('bgmEnabled', JSON.stringify(enabled));
    return { bgmEnabled: enabled };
  }),

  likeStory: (storyId) => set((state) => {
    if (state.likedStories.includes(storyId)) return state;
    const newLiked = [...state.likedStories, storyId];
    localStorage.setItem('likedStories', JSON.stringify(newLiked));
    return { likedStories: newLiked };
  }),

  unlikeStory: (storyId) => set((state) => {
    const newLiked = state.likedStories.filter(id => id !== storyId);
    localStorage.setItem('likedStories', JSON.stringify(newLiked));
    return { likedStories: newLiked };
  }),

  rateStory: (storyId, rating) => set((state) => {
    const newRated = { ...state.ratedStories, [storyId]: rating };
    localStorage.setItem('ratedStories', JSON.stringify(newRated));
    return { ratedStories: newRated };
  })
}));
