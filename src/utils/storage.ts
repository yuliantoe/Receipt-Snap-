import { User, StoreSettings, PhotoSession } from '../types';
import { INITIAL_USERS, INITIAL_SETTINGS, SAMPLE_SESSIONS } from '../data/initialData';

const STORAGE_KEYS = {
  USERS: 'snapreceipt_users',
  SETTINGS: 'snapreceipt_settings',
  SESSIONS: 'snapreceipt_sessions',
  CURRENT_USER: 'snapreceipt_current_user'
};

export function getUsers(): User[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading users from localStorage', e);
    return INITIAL_USERS;
  }
}

export function saveUsers(users: User[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving users to localStorage', e);
  }
}

export function addUser(newUser: Omit<User, 'id' | 'createdAt'>): User {
  const users = getUsers();
  const createdUser: User = {
    ...newUser,
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
    status: newUser.status || 'active'
  };
  const updated = [createdUser, ...users];
  saveUsers(updated);
  return createdUser;
}

export function updateUser(updatedUser: User): void {
  const users = getUsers();
  const updated = users.map(u => (u.id === updatedUser.id ? updatedUser : u));
  saveUsers(updated);
}

export function deleteUser(id: string): void {
  const users = getUsers();
  const updated = users.filter(u => u.id !== id);
  saveUsers(updated);
}

export function getSettings(): StoreSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading settings from localStorage', e);
    return INITIAL_SETTINGS;
  }
}

export function saveSettings(settings: StoreSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings to localStorage', e);
  }
}

export function getSessions(): PhotoSession[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(SAMPLE_SESSIONS));
      return SAMPLE_SESSIONS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading sessions from localStorage', e);
    return SAMPLE_SESSIONS;
  }
}

export function saveSession(session: Omit<PhotoSession, 'id' | 'sessionCode' | 'timestamp'>): PhotoSession {
  const sessions = getSessions();
  const count = sessions.length + 100;
  const newSession: PhotoSession = {
    ...session,
    id: `sess_${Date.now()}`,
    sessionCode: `RCPT-${Date.now().toString().slice(-5)}`,
    timestamp: new Date().toISOString()
  };
  const updated = [newSession, ...sessions];
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving session to localStorage', e);
  }
  return newSession;
}

export function getCurrentUser(): User {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (data) {
      const parsed = JSON.parse(data);
      const allUsers = getUsers();
      const matched = allUsers.find(u => u.id === parsed.id);
      if (matched) return matched;
    }
  } catch (e) {
    console.error('Error reading current user', e);
  }
  // Default to Admin or first user
  const users = getUsers();
  return users[0] || INITIAL_USERS[0];
}

export function setCurrentUser(user: User): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } catch (e) {
    console.error('Error setting current user', e);
  }
}
