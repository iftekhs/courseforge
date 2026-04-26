import { useDarkMode } from '@/hooks/use-dark-mode';
import { HugeiconsIcon } from '@hugeicons/react';
import { SunIcon, MoonIcon } from '@hugeicons/core-free-icons';

export function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg hover:bg-muted transition-colors"
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <HugeiconsIcon icon={SunIcon} className="h-5 w-5" />
      ) : (
        <HugeiconsIcon icon={MoonIcon} className="h-5 w-5" />
      )}
    </button>
  );
}