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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const ensuredProfileForUserRef = useRef<string | null>(null);

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
      // Profile creation is non-critical
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;

      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);

      if (nextSession?.user) {
        // Use setTimeout to avoid Supabase lock contention
        setTimeout(() => {
          if (isMounted) void ensureProfileExists(nextSession.user);
        }, 100);
      } else {
        ensuredProfileForUserRef.current = null;
      }
    });

    // THEN check for existing session
    const initializeSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          // If session retrieval fails (stale token, network), clear it
          console.warn('Session init failed, clearing local session:', error.message);
          try {
            await supabase.auth.signOut({ scope: 'local' });
          } catch {
            // Clear localStorage directly as fallback
            const storageKey = `sb-btxgpuyflevtxatpxisc-auth-token`;
            localStorage.removeItem(storageKey);
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
          void ensureProfileExists(data.session.user);
        }
      } catch {
        // On any failure, ensure we stop loading
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
    } catch (err) {
      return { error: new Error('Could not reach the signup service. Please try again.') };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { error: error as Error };
      }

      return { error: null };
    } catch {
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
