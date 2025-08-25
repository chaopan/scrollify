import React, { useState } from "react";
import { useProgressBarPosition } from "src/utils/useProgress";

export const ProgressBar = ({
  webPlayerState,
  onChangePosition,
}: {
  webPlayerState: any;
  onChangePosition: (newValue: number) => void;
}) => {
  const [currentPosition] = useProgressBarPosition({
    position: webPlayerState?.position,
    paused: webPlayerState?.paused,
    duration: webPlayerState?.duration,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [rangeValue, setRangeValue] = useState<number>(0);

  if (!webPlayerState) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRangeValue(Number(e.target.value));
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    onChangePosition(rangeValue);
  };

  return (
    <div className="relative flex w-full">
      <div
        className={`bg-accent/50 pointer-events-none absolute left-0 z-30 h-4 ${isDragging ? "visible" : "invisible"}`}
        style={{
          width: `${webPlayerState.duration ? (rangeValue / webPlayerState.duration) * 100 : 0}%`,
        }}
      />

      <input
        type="range"
        className="progress-slider w-full cursor-pointer"
        value={currentPosition || 0}
        onChange={handleChange}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleMouseUp}
        min={0}
        max={webPlayerState.duration}
      />
    </div>
  );
};
