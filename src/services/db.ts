import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Category, Story, AppSetting } from '../types';

export const dbService = {
  // Categories
  async getCategories(onlyEnabled = true) {
    try {
      let q = collection(db, 'categories') as any;
      if (onlyEnabled) {
        q = query(q, where('enabled', '==', true));
      }
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...(d.data() as any) } as Category));
    } catch (e) { handleFirestoreError(e, OperationType.LIST, 'categories'); return []; }
  },
  
  async getCategoryBySlug(slug: string) {
    try {
      const q = query(collection(db, 'categories'), where('slug', '==', slug), limit(1));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      return { id: snapshot.docs[0].id, ...(snapshot.docs[0].data() as any) } as Category;
    } catch (e) { handleFirestoreError(e, OperationType.GET, 'categories'); return null; }
  },

  // Stories
  async getStories(status?: 'published' | 'draft', catId?: string, limitCount = 50) {
    try {
      let constraints: any[] = [];
      if (status) constraints.push(where('status', '==', status));
      if (catId) constraints.push(where('categoryId', '==', catId));
      constraints.push(orderBy('createdAt', 'desc'));
      constraints.push(limit(limitCount));
      
      const q = query(collection(db, 'stories'), ...constraints);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...(d.data() as any) } as Story));
    } catch (e) { handleFirestoreError(e, OperationType.LIST, 'stories'); return []; }
  },

  async getStoryBySlug(slug: string) {
    try {
      const q = query(collection(db, 'stories'), where('slug', '==', slug), limit(1));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      return { id: snapshot.docs[0].id, ...(snapshot.docs[0].data() as any) } as Story;
    } catch (e) { handleFirestoreError(e, OperationType.GET, 'stories'); return null; }
  },

  async incrementStoryViews(story: Story) {
    try {
      const ref = doc(db, 'stories', story.id);
      await updateDoc(ref, { views: story.views + 1 });
    } catch (e) { handleFirestoreError(e, OperationType.UPDATE, `stories/${story.id}`); }
  },

  // Settings
  async getSetting(id: string) {
    try {
      const d = await getDoc(doc(db, 'settings', id));
      if (!d.exists()) return null;
      return { id: d.id, ...(d.data() as any) } as AppSetting;
    } catch (e) { handleFirestoreError(e, OperationType.GET, `settings/${id}`); return null; }
  }
};
