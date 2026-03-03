import { useState, useEffect, useRef, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isNetworkIssue = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  return /failed to fetch|networkerror|network error|timeout|timed out|abort/i.test(message);
};

const getAuthStorageKey = () => {
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  return projectId ? `sb-${projectId}-auth-token` : null;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const ensuredProfileForUserRef = useRef<string | null>(null);

  const clearLocalSession = async () => {
    try {
      await supabase.auth.signOut({ scope: 'local' });
    } catch {
      // ignore
    }

    const storageKey = getAuthStorageKey();
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  };

  const ensureProfileExists = async (authUser: User) => {
    if (ensuredProfileForUserRef.current === authUser.id) return;

    const username =
      (authUser.user_metadata?.username as string | undefined)?.trim() ||
      authUser.email?.split('@')[0] ||
      'player';

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (error) return;

      if (!data) {
        const { error: insertError } = await supabase.from('profiles').insert({
          user_id: authUser.id,
          username,
        });

        if (insertError && !insertError.message.toLowerCase().includes('duplicate')) {
          return;
        }
      }

      ensuredProfileForUserRef.current = authUser.id;
    } catch {
      // non-blocking
    }
  };

  useEffect(() => {
    let isMounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;

      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);

      if (nextSession?.user) {
        setTimeout(() => {
          if (isMounted) void ensureProfileExists(nextSession.user);
        }, 50);
      } else {
        ensuredProfileForUserRef.current = null;
      }
    });

    const initializeSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          if (isNetworkIssue(error)) {
            await clearLocalSession();
          }

          if (isMounted) {
            setSession(null);
            setUser(null);
            setLoading(false);
          }
          return;
        }

        if (isMounted) {
          setSession(data.session);
          setUser(data.session?.user ?? null);
          setLoading(false);
        }

        if (data.session?.user) {
          setTimeout(() => {
            if (isMounted) void ensureProfileExists(data.session.user);
          }, 50);
        }
      } catch {
        await clearLocalSession();

        if (isMounted) {
          setSession(null);
          setUser(null);
          setLoading(false);
        }
      }
    };

    void initializeSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { username: username.trim() },
        },
      });

      return { error: error as Error | null };
    } catch {
      return { error: new Error('Could not reach the signup service. Please try again.') };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (!error) {
        return { error: null };
      }

      if (isNetworkIssue(error)) {
        await clearLocalSession();
      }

      return { error: error as Error };
    } catch {
      await clearLocalSession();
      return { error: new Error('Could not reach the login service. Please try again.') };
    }
  };

  const signOut = async () => {
    ensuredProfileForUserRef.current = null;
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
