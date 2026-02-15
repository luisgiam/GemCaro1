export type EntryCategory = 'boundary' | 'physical' | 'audio' | 'custom';

export interface Entry {
  id: string;
  date: string; // ISO string
  category: EntryCategory;
  customCategoryName?: string;
  
  // Boundary ("Hasta aquí llegué")
  tirednessLevel?: number; // 1-10
  bodySensation?: string; // What they feel in body
  thought?: string; // What they think
  contextReaction?: string; // How others reacted
  
  // Physical Activity
  didActivity?: boolean;
  transformationNote?: string; // Did it help transform feeling/thinking/doing?

  // Audio / Coach Recommendation
  listened?: boolean;
  emotion?: string;
  
  // General AI Feedback stored
  aiFeedback?: string;
}

export interface Alarm {
  id: string;
  time: string; // HH:MM format
  label: string;
  active: boolean;
  days: number[]; // 0-6 (Sun-Sat)
}

export interface Biometrics {
  age: string;
  height: string;
  weight: string;
  gender: string;
  activityLevel: string;
}

export interface UserProfile {
  name: string;
  email?: string;
  biometrics?: Biometrics;
  customActions: string[]; // List of custom tracking types added by user
}