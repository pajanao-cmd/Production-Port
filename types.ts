
export type MediaType = 'video' | 'image';
export type MediaSubtype = 'highlight' | 'teaser' | 'bts' | 'breakdown' | 'still';

export interface Client {
  id: string;
  name: string;
  industry?: string;
  logo_url?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Role {
  id: string;
  name: string;
}

export interface ProjectRole {
  id: string;
  project_id: string;
  role_id: string;
  person_name: string;
  role?: Role;
}

export interface Project {
  id: string;
  title: string;
  client_id: string;
  category_id: string;
  year: number;
  // Added role property to fix TS errors in App.tsx and ProjectCard.tsx
  role: string;
  description: string;
  cover_url: string;
  is_published: boolean;
  sort_order: number;
  client?: Client;
  category?: Category;
  project_roles?: ProjectRole[];
}

export interface MediaItem {
  id: string;
  project_id: string;
  type: MediaType;
  subtype: MediaSubtype;
  url: string;
  thumbnail_url?: string;
  title?: string;
  sort_order: number;
  is_cover: boolean;
}

export interface OfflineProject extends Project {
  mediaItems: MediaItem[];
  downloadedAt: number;
}

// --- Profile & CV Types ---

export interface ExperienceItem {
  id: string;
  year: string;
  role: string;
  company: string;
  desc: string;
}

export interface AwardItem {
  id: string;
  award: string;
  category: string;
  year: string;
}

export interface Profile {
  name: string;
  role: string;
  location: string;
  availability: string;
  bio: string;
  email: string;
  phone: string;
  avatar_url: string;
  experience: ExperienceItem[];
  awards: AwardItem[];
  clients: string[];
}
