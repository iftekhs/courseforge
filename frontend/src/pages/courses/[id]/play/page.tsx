import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeftIcon, Link01Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { usePreferences } from '../../../settings/hooks/use-preferences';

const API_BASE = 'http://127.0.0.1:8000/api/v1';

export default function CoursePlayPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { preferExternal } = usePreferences();
  
  const rawPath = searchParams.get('path');
  const path = rawPath ? decodeURIComponent(rawPath) : '';
  const [videoSrc, setVideoSrc] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!path) return;
    
    setLoading(true);
    setVideoSrc(`${API_BASE}/video/${encodeURIComponent(path)}`);
  }, [path]);

  const handleOpenExternal = () => {
    const w = window as any;
    if (w.pywebview?.api) {
      w.pywebview.api.open_in_system_player(path);
    }
  };

  if (!path) {
    return (
      <div className="p-6">
        <p>No video selected</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <HugeiconsIcon icon={ArrowLeftIcon} className="h-4 w-4 mr-2" />
          Back
        </Button>
        {!preferExternal && (
          <Button variant="outline" onClick={handleOpenExternal}>
            <HugeiconsIcon icon={Link01Icon} className="h-4 w-4 mr-2" />
            Open in System Player
          </Button>
        )}
      </div>
      
      <div className="w-full max-w-4xl mx-auto">
        <video
          src={videoSrc}
          controls
          className="w-full rounded-lg bg-black"
          style={{ maxHeight: '70vh' }}
          onLoadedData={() => setLoading(false)}
          onError={() => setLoading(false)}
        >
          Your browser does not support video playback.
        </video>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p>Loading video...</p>
          </div>
        )}
      </div>
    </div>
  );
}