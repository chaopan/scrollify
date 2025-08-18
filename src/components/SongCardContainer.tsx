import React, { useEffect, useState, useRef } from "react";
import { playTrack } from "../utils/spotify/play";
import { setupWebPlayer } from "../utils/spotify/webPlayer";
import { SongCard } from "./SongCard";
import { useOnce } from "../utils/useOnce";
import {
  SpotifyTrack,
  SpotifyWebPlayer,
  SpotifyResults,
  Track,
} from "src/types";
import { EmptyCard } from "./EmptyCard";
import { searchTrack } from "src/utils/spotify/searchTrack";
import { Scroller } from "./Scroller";
import { StartCard } from "src/components/StartCard";
import { debounce } from "src/utils/debounce";
import { getTopItems } from "src/utils/spotify/getTopItems";
import { getSuggestions } from "src/utils/queryAi";
const INITIAL_QUEUE_LENGTH = 2;

const normalizeTrack = (spotifyTrack: SpotifyTrack): Track => {
  return { name: spotifyTrack.name, artist: spotifyTrack.artists[0].name };
};

const setLocalVolume = debounce((value: number) => {
  console.log("persisting volume");
  localStorage.setItem("music_volume", `${value}`);
}, 1000);

export const SongCardContainer = () => {
  const [isPaused, setIsPaused] = useState(true);
  const [deviceId, setDeviceId] = useState("");
  const [scrollIndex, setScrollIndex] = useState(0);
  const [volume, setVolume] = useState(
    Number(localStorage.getItem("music_volume")) || 0.5,
  );
  const [suggestedTracks, setSuggestedTracks] = useState<Track[]>([]);
  const [foundTracks, setFoundTracks] = useState<SpotifyTrack[]>([]);

  const webPlayer = useRef<SpotifyWebPlayer | null>(null);

  useOnce(() => {
    setupWebPlayer(handlePlayerSetup, handlePlayerStateChanged, volume);
  });

  useEffect(() => {
    if (foundTracks.length > 0 && scrollIndex === 0) {
      // Only trigger on first load when tracks are available
      handleNextTrack();
    }
  }, [foundTracks]);

  const handleStart = async () => {
    try {
      const spotifyResults: SpotifyResults = await getTopItems("tracks");
      console.log("topTracks", spotifyResults.items);
      const normalizedTracks = spotifyResults.items.map((spotifyTrack) => {
        return normalizeTrack(spotifyTrack);
      });

      //get gemini suggestions TODO: suggestion sizes
      const aiResultTracks = await getSuggestions(normalizedTracks);
      console.log("suggestedTracks", aiResultTracks);
      setSuggestedTracks(aiResultTracks);

      const searchResults = await Promise.all(
        Array.from({ length: INITIAL_QUEUE_LENGTH }, async (_, index) => {
          const aiTrack = aiResultTracks[index];
          const result = await searchTrack(aiTrack.name, aiTrack.artist);
          return result;
        }),
      );

      const trackList = searchResults.filter(
        (track): track is SpotifyTrack => track !== undefined,
      );
      setFoundTracks(trackList);

      //next handleNextTrack.

      setTimeout(() => handleNextTrack(), 1000);
    } catch (e) {
      console.error("ERROR:", e);
    }
  };

  const handlePlayerSetup = (newPlayer: SpotifyWebPlayer, deviceId: string) => {
    webPlayer.current = newPlayer;
    setDeviceId(deviceId);
    //testing
    // playTrack(tracks[0].id, deviceId);
  };

  const handlePlayerStateChanged = (state: { paused: boolean }) => {
    console.log("handleplayerstatechanged", state);
    setIsPaused(state.paused);
  };

  const handlePreviousTrack = () => {
    handleScroll(scrollIndex - 1);
  };

  const handleNextTrack = () => {
    handleScroll(scrollIndex + 1);
  };

  const handlePlayPause = () => {
    webPlayer.current?.togglePlay();
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    setLocalVolume(value);
    webPlayer.current?.setVolume(value);
  };

  const handleAddTrack = async () => {
    const nextAiTrack = suggestedTracks[foundTracks.length];
    const nextSpotifyTrack = await searchTrack(
      nextAiTrack.name,
      nextAiTrack.artist,
    );
    if (nextSpotifyTrack) {
      setFoundTracks([...foundTracks, nextSpotifyTrack]);
    }
  };

  const handleScroll = (idx: number) => {
    console.log("handleScroll", idx, foundTracks.length);
    if (idx < 0) {
      return;
    }
    if (idx >= foundTracks.length + 1) {
      return;
    }
    const trackIndex = idx - 1;
    console.log("now playing", idx, foundTracks[idx]);
    const currentTrack = foundTracks[trackIndex];
    playTrack(currentTrack.id, deviceId);
    setScrollIndex(idx);
    //get next track and append to tracks
    console.log("trackIndex", { trackIndex, fl: foundTracks.length });
    const onPrevLastTrack = trackIndex === foundTracks.length - 1;
    if (onPrevLastTrack) {
      handleAddTrack();
    }
  };

  return (
    <div>
      <Scroller className="gap-20" index={scrollIndex}>
        <StartCard
          className="m-20 flex-shrink-0 snap-center"
          onStart={handleStart}
        />
        {foundTracks.map((track, trackIndex) => {
          return (
            <SongCard
              key={track.name}
              className="m-20 flex-shrink-0 snap-center"
              track={track}
              isSongCurrent={isSongCurrent(scrollIndex, trackIndex)}
              onNextTrack={handleNextTrack}
              onPreviousTrack={handlePreviousTrack}
              onPlayPause={handlePlayPause}
              isPaused={isSongPaused(scrollIndex, trackIndex, isPaused)}
              onVolumeChange={handleVolumeChange}
              volume={volume}
            />
          );
        })}
      </Scroller>
    </div>
  );
};

const isSongPaused = (
  scrollIndex: number,
  trackIndex: number,
  pauseState: boolean,
) => {
  if (scrollIndex === trackIndex + 1) {
    return pauseState;
  }
  return true;
};

const isSongCurrent = (scrollIndex: number, trackIndex: number) => {
  return scrollIndex === trackIndex + 1;
};
