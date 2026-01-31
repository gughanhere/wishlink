import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { UserProfile } from '@/types';
import { hashPassword, verifyPassword } from '@/types';

const USERS_KEY = 'wishlink_users';
const CURRENT_USER_KEY = 'wishlink_current_user';

export function useAuth() {
  const [users, setUsers] = useLocalStorage<Record<string, UserProfile>>(USERS_KEY, {});
  const [currentUser, setCurrentUser] = useLocalStorage<string | null>(CURRENT_USER_KEY, null);

  const isUserRegistered = useCallback((phone: string): boolean => {
    return !!users[phone];
  }, [users]);

  const registerUser = useCallback((phone: string, password: string): boolean => {
    if (users[phone]) {
      return false; // User already exists
    }

    const newUser: UserProfile = {
      phone,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
    };

    setUsers(prev => ({ ...prev, [phone]: newUser }));
    setCurrentUser(phone);
    return true;
  }, [users, setUsers, setCurrentUser]);

  const loginUser = useCallback((phone: string, password: string): boolean => {
    const user = users[phone];
    if (!user) {
      return false;
    }

    if (verifyPassword(password, user.passwordHash)) {
      setCurrentUser(phone);
      return true;
    }
    return false;
  }, [users, setCurrentUser]);

  const logoutUser = useCallback(() => {
    setCurrentUser(null);
  }, [setCurrentUser]);

  const getCurrentUser = useCallback((): UserProfile | null => {
    if (!currentUser) return null;
    return users[currentUser] || null;
  }, [currentUser, users]);

  const changePassword = useCallback((phone: string, oldPassword: string, newPassword: string): boolean => {
    const user = users[phone];
    if (!user) return false;

    if (!verifyPassword(oldPassword, user.passwordHash)) {
      return false;
    }

    setUsers(prev => ({
      ...prev,
      [phone]: {
        ...user,
        passwordHash: hashPassword(newPassword),
      },
    }));
    return true;
  }, [users, setUsers]);

  return {
    users,
    currentUser,
    isUserRegistered,
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    changePassword,
  };
}
