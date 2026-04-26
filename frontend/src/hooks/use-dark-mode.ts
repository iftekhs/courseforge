import { useEffect, useState, useCallback } from 'react';
import { getDarkModePreference, setDarkModePreference } from '../pages/settings/hooks/use-preferences';

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => getDarkModePreference());

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    const newValue = !darkMode;
    setDarkModePreference(newValue);
    setDarkMode(newValue);
    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return {
    darkMode,
    toggleDarkMode,
  };
}