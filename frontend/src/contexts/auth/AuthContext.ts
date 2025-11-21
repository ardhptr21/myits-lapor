import { createContext } from 'react';
import type { User } from '../../types/user';

export type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  getUser: () => Promise<User | null>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
