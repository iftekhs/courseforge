import { useDarkMode } from '@/hooks/use-dark-mode';

export function Logo() {
  const { darkMode } = useDarkMode();

  return (
    <img
      src={darkMode ? '/logo-white.svg' : '/logo.svg'}
      alt="CourseForge Logo"
      className="h-8 w-auto"
    />
  )
}