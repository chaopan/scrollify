export type SpotifyResults = {
  items: SpotifyTrack[];
};

export type SpotifyTrack = {
  name: string;
  artists: {
    name: string;
    id: string;
    uri: string;
  }[];
  album?: {
    name: string;
    images?: {
      url: string;
      height?: number;
      width?: number;
    }[];
  };
  id: string;
  uri: string;
  duration_ms: number;
  [key: string]: any;
};

export type SpotifyWebPlayer = {
  previousTrack: () => Promise<any>;
  togglePlay: () => Promise<any>;
  setVolume: (volume: number) => Promise<any>;
  addListener: any;
  removeListener: any;
  seek: (position_ms: number) => Promise<any>;
};

/**
 * Spotify Web Playback State object as a TypeScript type.
 */
export type WebPlaybackTrack = {
  uri: string;
  id: string;
  type: string;
  media_type: string;
  name: string;
  is_playable: boolean;
  album: {
    uri: string;
    name: string;
    images: { url: string; height: number; width: number }[];
  };
  artists: { uri: string; name: string }[];
  duration_ms: number;
  [key: string]: any;
};

export type SpotifyWebPlaybackState = {
  /**
   * The context of the playback (album, playlist, etc).
   */
  context: {
    uri: string | null; // The URI of the context (can be null)
    metadata: Record<string, any> | null; // Additional metadata for the context (can be null)
  };

  disallows: {
    pausing?: boolean;
    peeking_next?: boolean;
    peeking_prev?: boolean;
    resuming?: boolean;
    seeking?: boolean;
    skipping_next?: boolean;
    skipping_prev?: boolean;
  };
  paused: boolean;
  position: number;
  repeat_mode: 0 | 1 | 2;
  shuffle: boolean;
  track_window: {
    current_track: WebPlaybackTrack;
    previous_tracks: WebPlaybackTrack[];
    next_tracks: WebPlaybackTrack[];
  };
};

type Track = {
  name: string;
  artist: string;
};
