const PREFER_EXTERNAL_KEY = 'preferExternalPlayer';
const DARK_MODE_KEY = 'darkMode';

export function getPlaybackPreference(): boolean {
  try {
    return localStorage.getItem(PREFER_EXTERNAL_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setPlaybackPreference(external: boolean): void {
  try {
    localStorage.setItem(PREFER_EXTERNAL_KEY, String(external));
  } catch {
    // Silently fail
  }
}

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
  const preferExternal = getPlaybackPreference();
  const darkMode = getDarkModePreference();

  const setPreference = (external: boolean) => {
    setPlaybackPreference(external);
  };

  const setDarkMode = (dark: boolean) => {
    setDarkModePreference(dark);
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return {
    preferExternal,
    setPreference,
    darkMode,
    setDarkMode,
  };
}