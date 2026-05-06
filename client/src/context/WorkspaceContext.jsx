import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const FAVORITES_STORAGE_KEY = 'contentai_favorite_generations';

const WorkspaceContext = createContext(null);

function loadFavoriteIds() {
  try {
    const storedValue = localStorage.getItem(FAVORITES_STORAGE_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch (error) {
    console.error('Workspace favorites load error:', error);
    return [];
  }
}

export function WorkspaceProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useState(loadFavoriteIds);

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const value = useMemo(
    () => ({
      favoriteIds,
      toggleFavorite: (generationId) => {
        setFavoriteIds((currentIds) =>
          currentIds.includes(generationId)
            ? currentIds.filter((id) => id !== generationId)
            : [generationId, ...currentIds]
        );
      },
      isFavorite: (generationId) => favoriteIds.includes(generationId),
      clearFavorites: () => setFavoriteIds([]),
    }),
    [favoriteIds]
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider.');
  }

  return context;
}
