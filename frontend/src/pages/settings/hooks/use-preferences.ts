const PREFER_EXTERNAL_KEY = 'preferExternalPlayer';

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

export function usePreferences() {
  const preferExternal = getPlaybackPreference();

  const setPreference = (external: boolean) => {
    setPlaybackPreference(external);
  };

  return {
    preferExternal,
    setPreference,
  };
}