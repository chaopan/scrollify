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
import { ProgressBar } from "./ProgressBar";
import { useColorFromImage } from "src/utils/useColor";

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
  webPlayerState: any;
  onSeek: (newPos: number) => void;
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
  webPlayerState,
  onSeek,
}: SongCardProps) => {
  const primaryColor = "black";
  const imageUrl = track.album?.images?.[0]?.url;
  const imageRef = useRef<HTMLImageElement>(null);
  useColorFromImage(imageRef.current, isSongCurrent);

  if (!track) {
    <div>no track</div>;
  }
  return (
    <div
      className={`h-640 w-360 relative m-20 flex flex-shrink-0 flex-col justify-end overflow-hidden rounded-xl shadow-xl ${className}`}
    >
      {isSongCurrent && (
        <VolumeSlider
          className="z-20 mb-auto"
          onChange={onVolumeChange}
          value={volume}
        />
      )}
      <img
        className={`card-img__${track.id}`}
        ref={imageRef}
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
        className="bottom_card_img z-1 top-480 pointer-events-none absolute h-3/4 scale-y-[-1] select-none object-cover object-bottom blur-xl"
        src={imageUrl}
        alt=""
        aria-hidden="true"
      />
      <div className="song_card_bottom z-3 absolute flex h-1/4 w-full flex-col items-center bg-white/60 p-10 pt-5">
        <h2
          id="current_track_name"
          className="relative z-10 self-center whitespace-nowrap text-2xl font-bold"
        >
          {track.name}
        </h2>
        <p id="current_track_title" className="relative z-10 self-center">
          {track.artists[0].name}
        </p>

        <div
          id="song_card_controls"
          className="relative z-20 mb-10 mt-10 flex flex-row justify-center gap-20"
        >
          <button
            className="btn-spotify m-1 cursor-pointer p-10"
            onClick={onPreviousTrack}
          >
            <RewindIcon size="20px" color={primaryColor} />
          </button>

          <button
            className="btn-spotify m-1 flex cursor-pointer items-center justify-center rounded-full border-2 p-10"
            style={{
              borderColor: primaryColor,
            }}
            onClick={onPlayPause}
          >
            {isPaused ? (
              <PlayIcon size="30px" color={primaryColor} />
            ) : (
              <PauseIcon size="30px" color={primaryColor} />
            )}
          </button>

          <button
            className="btn-spotify m-1 cursor-pointer p-10"
            onClick={onNextTrack}
          >
            <FastForwardIcon size="20px" color={primaryColor} />
          </button>
        </div>
        {isSongCurrent && (
          <ProgressBar
            webPlayerState={webPlayerState}
            onChangePosition={onSeek}
          />
        )}
      </div>
    </div>
  );
};
