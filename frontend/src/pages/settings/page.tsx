import { usePreferences } from './hooks/use-preferences';

export default function SettingsPage() {
  const { darkMode, setDarkMode } = usePreferences();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="flex items-center justify-between max-w-md">
        <div>
          <p className="font-medium">Dark Mode</p>
          <p className="text-sm text-muted-foreground">
            Use dark theme for the application
          </p>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-4 py-2 rounded-md border ${
            darkMode ? 'bg-primary text-primary-foreground' : 'bg-background'
          }`}
        >
          {darkMode ? 'On' : 'Off'}
        </button>
      </div>
    </div>
  );
}