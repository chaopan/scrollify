import React, { useEffect, useState, useRef } from "react";
import { playTrack } from "../utils/spotify/play";
import { setupWebPlayer } from "../utils/spotify/webPlayer";
import { SongCard } from "./SongCard";
import { useOnce } from "../utils/useOnce";

export const SongCardContainer = ({ track, onNextTrack }) => {
  const [isPaused, setIsPaused] = useState(true);
  const [deviceId, setDeviceId] = useState(null);
  const webPlayer = useRef(null);
  console.log("webPlayer.current", webPlayer.current);

  useEffect(() => {
    playTrack(track.id, deviceId);
  }, [track]);

  useOnce(() => {
    setupWebPlayer(handlePlayerSetup, handlePlayerStateChanged);
  });

  const handlePlayerSetup = (newPlayer, deviceId) => {
    webPlayer.current = newPlayer;
    console.log("playing track", track);
    setDeviceId(deviceId);
    playTrack(track.id, deviceId);
  };

  const handlePlayerStateChanged = (state) => {
    setIsPaused(state.paused);
  };

  const handlePreviousTrack = () => {
    webPlayer.current?.previousTrack();
  };

  const handlePlayPause = () => {
    webPlayer.current?.togglePlay();
  };

  const handleVolumeChange = (value: number) => {
    webPlayer.current?.setVolume(value);
  };

  if (!track) {
    return <div>placeholder</div>;
  }

  return (
    <SongCard
      track={track}
      onNextTrack={onNextTrack}
      onPreviousTrack={handlePreviousTrack}
      onPlayPause={handlePlayPause}
      isPaused={isPaused}
      onVolumeChange={handleVolumeChange}
    />
  );
};
