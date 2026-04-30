import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';

interface VideoPlayerProps {
  src: string;
  title: string;
}

export default function VideoPlayer({ src, title }: VideoPlayerProps) {
  return (
    <div className="w-full rounded-lg overflow-hidden" style={{ contain: 'layout style' }}>
      <MediaPlayer
        title={title}
        src={src}
        load="eager"
      >
        <MediaProvider />
        <DefaultVideoLayout
          icons={defaultLayoutIcons}
        />
      </MediaPlayer>
    </div>
  );
}