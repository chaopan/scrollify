import React, { useEffect, useState, useRef } from "react";
import { playTrack } from "../utils/spotify/play";
import { VolumeSlider } from "./VolumeSlider";
import { SpotifyTrack } from "src/types";
import {
  PlayIcon,
  PauseIcon,
  FastForwardIcon,
  RewindIcon,
} from "@phosphor-icons/react";
import { ScrubBar } from "./ScrubBar";

type SongCardProps = {
  className: string;
  track: SpotifyTrack;
  onPreviousTrack: () => void;
  onPlayPause: () => void;
  onNextTrack: () => void;
  isPaused: boolean;
  onVolumeChange: (volume: number) => void;
  isSongCurrent: boolean;
  volume: number;
};

export const SongCard = ({
  className,
  track,
  onPreviousTrack,
  onPlayPause,
  onNextTrack,
  isPaused,
  onVolumeChange,
  isSongCurrent = false,
  volume = 0.5,
}: SongCardProps) => {
  if (!track) {
    <div>no track</div>;
  }
  const imageUrl = track.album?.images?.[0]?.url;

  return (
    <div
      className={`h-640 w-360 relative flex flex-col justify-end overflow-hidden rounded-xl shadow-xl ${className}`}
    >
      <VolumeSlider
        className="z-20 mb-auto"
        onChange={onVolumeChange}
        value={volume}
      />
      <img
        src={imageUrl}
        style={{
          position: "absolute",
          inset: 0,
          height: "75%",
          objectFit: "cover",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 2,
        }}
        alt={track.name}
      />
      <img
        src={imageUrl}
        style={{
          position: "absolute",
          bottom: 0,
          height: "100%",
          // height: "20%",
          objectFit: "cover",
          objectPosition: "bottom",
          // filter: "blur(24px) brightness(0.8)",
          zIndex: 1,
          pointerEvents: "none",
          userSelect: "none",
        }}
        alt=""
        aria-hidden="true"
      />
      <div
        className="song_card_bottom flex flex-col items-center pb-20 pt-10"
        style={{
          position: "absolute",
          zIndex: 3,
          backgroundColor: "rgba(245,245,255,0.75)",
          backdropFilter: "blur(20px)",
          height: "25%",
          width: "100%",
        }}
      >
        <h2
          id="current_track_name"
          className="relative z-10 self-center whitespace-nowrap text-2xl font-bold"
        >
          {track.name}
        </h2>
        <p
          id="current_track_title"
          className="relative z-10 self-center font-bold"
        >
          {track.artists[0].name}
        </p>

        <div
          id="song_card_controls"
          className="relative z-20 mt-auto flex flex-row justify-center gap-20"
        >
          <button
            className="btn-spotify m-1 cursor-pointer"
            onClick={onPreviousTrack}
          >
            <RewindIcon />
          </button>

          <button
            className="btn-spotify h-50 w-50 m-1 flex cursor-pointer items-center justify-center rounded-full border-2 border-white"
            onClick={onPlayPause}
          >
            {isPaused ? <PlayIcon /> : <PauseIcon />}
          </button>

          <button
            className="btn-spotify m-1 cursor-pointer"
            onClick={onNextTrack}
          >
            <FastForwardIcon />
          </button>
        </div>
        {isSongCurrent && (
          <ScrubBar paused={isPaused} durationMs={track.duration_ms} />
        )}
      </div>
    </div>
  );
};
