<<<<<<< Updated upstream
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { apiFetch, UserProgress } from '../utils/Utils';
=======
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getuserprog } from '../utils/Utils';
>>>>>>> Stashed changes

type GamificationContextType = {
  xp: number;
  lives: number;
<<<<<<< Updated upstream
=======
  streak: number;
  level: number;
  loading: boolean;
  error: boolean;
>>>>>>> Stashed changes
  addXp: (amount: number) => void;
  setXp: (value: number) => void;
  loseLife: () => void;
  addLife: () => void;
<<<<<<< Updated upstream
  setLives: (value: number) => void;
  refreshStats: () => Promise<void>;
=======
  syncWithBackend: () => Promise<void>;
>>>>>>> Stashed changes
};

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used inside GamificationProvider');
  }
  return context;
};

export const GamificationProvider = ({ children }: { children: ReactNode }) => {
<<<<<<< Updated upstream
  const [xp, setXp] = useState<number>(() => {
    const stored = localStorage.getItem('xp');
    return stored ? Number(stored) : 0;
  });

  const [lives, setLives] = useState<number>(() => {
    const stored = localStorage.getItem('lives');
    return stored ? Number(stored) : 0;
  });

=======
  const [xp, setXp] = useState<number>(0);
  const [lives, setLives] = useState<number>(5);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch from backend and force update lives
  const syncWithBackend = async () => {
    try {
      console.log('=== SYNCING WITH BACKEND ===')
      const response = await getuserprog();
      
      if (!response) {
        console.error('No response from backend')
        setError(true);
        return;
      }

      console.log('Backend response:', response)
      console.log('Backend lives:', response.lives)
      console.log('Current local lives:', lives)

      // ALWAYS update lives from backend (with validation)
      if (response.lives !== undefined) {
        const backendLives = Math.max(0, response.lives);
        console.log('Updating lives from', lives, 'to', backendLives)
        setLives(backendLives);
        localStorage.setItem('lives', String(backendLives));
      } else {
        console.warn('Backend did not return lives')
      }

      setError(false);
      console.log('=== SYNC COMPLETE ===')

    } catch (error) {
      console.error('Error syncing with backend:', error)
      setError(true);
    }
  };

  // Initial load on mount
  useEffect(() => {
    console.log('GamificationProvider mounted - loading initial data')
    
    const loadInitialData = async () => {
      setLoading(true);
      
      // Load XP from localStorage (XP is local only)
      const storedXp = localStorage.getItem('xp');
      console.log('Stored XP:', storedXp)
      
      if (storedXp) {
        const xpValue = Math.max(0, Number(storedXp));
        setXp(xpValue);
      }
      
      try {
        // Fetch lives from backend
        console.log('Fetching lives from backend...')
        const response = await getuserprog();
        
        if (response && response.lives !== undefined) {
          const backendLives = Math.max(0, response.lives);
          console.log('Initial lives from backend:', backendLives)
          setLives(backendLives);
          localStorage.setItem('lives', String(backendLives));
          setError(false);
        } else {
          console.log('No backend response, using default lives')
          const storedLives = localStorage.getItem('lives');
          setLives(storedLives ? Math.max(0, Number(storedLives)) : 5);
          setError(true);
        }
      } catch (err) {
        console.error('Error loading from backend:', err)
        const storedLives = localStorage.getItem('lives');
        setLives(storedLives ? Math.max(0, Number(storedLives)) : 5);
        setError(true);
      } finally {
        setLoading(false);
        console.log('Initial load complete - XP:', xp, 'Lives:', lives)
      }
    };

    loadInitialData();
  }, []);

  // Save XP to localStorage whenever it changes
>>>>>>> Stashed changes
  useEffect(() => {
    if (!loading) {
      console.log('XP changed, saving to localStorage:', xp)
      localStorage.setItem('xp', String(xp));
    }
  }, [xp, loading]);

<<<<<<< Updated upstream
  const refreshStats = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      console.log('Refreshing stats from backend...');
      const data = await apiFetch<UserProgress>('/questions/user/progress');

      if (data) {
        console.log('Stats refreshed:', data);
        if (data.xp !== undefined) setXp(data.xp);
        if (data.lives !== undefined) setLives(data.lives);
      }
    } catch (error) {
      console.error('Failed to refresh stats:', error);
    }
  }, []);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

=======
  // Add XP (local only, never from backend)
>>>>>>> Stashed changes
  const addXp = (amount: number) => {
    console.log('Adding XP:', amount)
    setXp(prev => {
      const newXp = Math.max(0, prev + amount);
      console.log('XP updated:', prev, '->', newXp)
      return newXp;
    });
  };

  // Lose life (local, then sync from backend)
  const loseLife = () => {
    console.log('Losing a life (local)')
    setLives(prev => {
      const newLives = Math.max(0, prev - 1);
      console.log('Lives updated locally:', prev, '->', newLives)
      localStorage.setItem('lives', String(newLives));
      return newLives;
    });
  };

  // Add life (local)
  const addLife = () => {
    console.log('Adding a life')
    setLives(prev => {
      const newLives = prev + 1;
      console.log('Lives updated:', prev, '->', newLives)
      localStorage.setItem('lives', String(newLives));
      return newLives;
    });
  };

  // Loading screen while fetching initial data
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'var(--bg-main)',
        color: 'var(--text-main)',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <h2>Loading...</h2>
        <p>Fetching your progress...</p>
      </div>
    );
  }

  return (
    <GamificationContext.Provider
      value={{
        xp,
        lives,
<<<<<<< Updated upstream
=======
        streak,
        level,
        loading,
        error,
>>>>>>> Stashed changes
        addXp,
        setXp,
        loseLife,
        addLife,
<<<<<<< Updated upstream
        setLives,
        refreshStats,
=======
        syncWithBackend,
>>>>>>> Stashed changes
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};