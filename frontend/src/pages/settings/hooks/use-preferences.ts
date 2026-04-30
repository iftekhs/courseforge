const DARK_MODE_KEY = 'darkMode';

export function getDarkModePreference(): boolean {
  try {
    const stored = localStorage.getItem(DARK_MODE_KEY);
    if (stored !== null) {
      return stored === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}

export function setDarkModePreference(dark: boolean): void {
  try {
    localStorage.setItem(DARK_MODE_KEY, String(dark));
  } catch {
    // Silently fail
  }
}

export function usePreferences() {
  const darkMode = getDarkModePreference();

  const setDarkMode = (dark: boolean) => {
    setDarkModePreference(dark);
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return {
    darkMode,
    setDarkMode,
  };
}