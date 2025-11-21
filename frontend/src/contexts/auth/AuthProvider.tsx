import type { ReactNode } from 'react';
import { startTransition, useEffect, useState } from 'react';
import { api } from '../../libs/api';
import type { APIResponse } from '../../types/api';
import type { User } from '../../types/user';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const getUser = async (): Promise<User | null> => {
    try {
      const res = await api.get<APIResponse<User>>('/auth/me');
      setUser(res.data.data!);
      return res.data.data!;
    } catch {
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await api.get<APIResponse<User>>('/auth/me');
        const u = res.data.data ?? null;
        if (mounted) {
          startTransition(() => {
            setUser(u);
          });
        }
      } catch {
        if (mounted) {
          startTransition(() => {
            setUser(null);
          });
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return <AuthContext.Provider value={{ user, setUser, getUser }}>{children}</AuthContext.Provider>;
}
