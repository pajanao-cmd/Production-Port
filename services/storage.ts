
import { Project, MediaItem, OfflineProject } from '../types';

const OFFLINE_KEY = 'portfolio_offline_metadata';
const DB_NAME = 'ProductionPortfolioDB';
const STORE_NAME = 'media_blobs';

// Simple IndexedDB wrapper for binary data
const getDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const storageService = {
  async saveBlob(url: string, blob: Blob): Promise<void> {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(blob, url);
    return new Promise((resolve) => (tx.oncomplete = () => resolve()));
  },

  async getBlobUrl(url: string): Promise<string | null> {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).get(url);
    return new Promise((resolve) => {
      request.onsuccess = () => {
        if (request.result instanceof Blob) {
          resolve(URL.createObjectURL(request.result));
        } else {
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });
  },

  async saveProjectOffline(project: Project, mediaItems: MediaItem[]): Promise<void> {
    // 1. Download all media items as blobs
    for (const item of mediaItems) {
      try {
        const response = await fetch(item.url);
        const blob = await response.blob();
        await this.saveBlob(item.url, blob);
        if (item.thumbnail_url) {
          const thumbResp = await fetch(item.thumbnail_url);
          const thumbBlob = await thumbResp.blob();
          await this.saveBlob(item.thumbnail_url, thumbBlob);
        }
      } catch (e) {
        console.error(`Failed to download ${item.url}`, e);
      }
    }

    // 2. Save metadata
    const existing = await this.getOfflineProjects();
    const offlineProject: OfflineProject = {
      ...project,
      mediaItems,
      downloadedAt: Date.now()
    };
    
    const updated = { ...existing, [project.id]: offlineProject };
    localStorage.setItem(OFFLINE_KEY, JSON.stringify(updated));
  },

  async getOfflineProjects(): Promise<Record<string, OfflineProject>> {
    const data = localStorage.getItem(OFFLINE_KEY);
    return data ? JSON.parse(data) : {};
  },

  async isProjectOffline(id: string): Promise<boolean> {
    const data = await this.getOfflineProjects();
    return !!data[id];
  },

  async removeOfflineProject(id: string): Promise<void> {
    const existing = await this.getOfflineProjects();
    const project = existing[id];
    if (project) {
      const db = await getDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      project.mediaItems.forEach(item => store.delete(item.url));
      delete existing[id];
      localStorage.setItem(OFFLINE_KEY, JSON.stringify(existing));
    }
  }
};
