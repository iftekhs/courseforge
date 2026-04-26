import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePreferences } from './hooks/use-preferences';

export default function SettingsPage() {
  const { preferExternal, setPreference } = usePreferences();
  const [localPref, setLocalPref] = useState(preferExternal);

  const handleToggle = () => {
    const newValue = !localPref;
    setLocalPref(newValue);
    setPreference(newValue);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Video Playback</CardTitle>
          <CardDescription>
            Choose how to play videos when available.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Use system player</p>
              <p className="text-sm text-muted-foreground">
                Opens videos in your default video player instead of in-app
              </p>
            </div>
            <Button
              variant={localPref ? 'default' : 'outline'}
              onClick={handleToggle}
              className={localPref ? 'bg-primary' : ''}
            >
              {localPref ? 'On' : 'Off'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}