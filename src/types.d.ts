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
};

type Track = {
  name: string;
  artist: string;
};
