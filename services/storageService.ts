import { Entry, Alarm, UserProfile } from '../types';

const KEYS = {
  ENTRIES: 'tc_entries',
  ALARMS: 'tc_alarms',
  PROFILE: 'tc_profile',
};

export const StorageService = {
  getEntries: (): Entry[] => {
    try {
      const data = localStorage.getItem(KEYS.ENTRIES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error loading entries", e);
      return [];
    }
  },

  saveEntry: (entry: Entry): Entry[] => {
    const entries = StorageService.getEntries();
    const newEntries = [entry, ...entries];
    localStorage.setItem(KEYS.ENTRIES, JSON.stringify(newEntries));
    return newEntries;
  },

  getAlarms: (): Alarm[] => {
    try {
      const data = localStorage.getItem(KEYS.ALARMS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveAlarms: (alarms: Alarm[]) => {
    localStorage.setItem(KEYS.ALARMS, JSON.stringify(alarms));
  },

  getProfile: (): UserProfile => {
    try {
      const data = localStorage.getItem(KEYS.PROFILE);
      return data ? JSON.parse(data) : { name: 'Usuario', customActions: [] };
    } catch (e) {
      return { name: 'Usuario', customActions: [] };
    }
  },

  saveProfile: (profile: UserProfile) => {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  },
  
  updateEntry: (updatedEntry: Entry): Entry[] => {
    const entries = StorageService.getEntries();
    const newEntries = entries.map(e => e.id === updatedEntry.id ? updatedEntry : e);
    localStorage.setItem(KEYS.ENTRIES, JSON.stringify(newEntries));
    return newEntries;
  }
};
