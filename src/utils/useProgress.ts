import { useEffect, useState, useRef } from "react";

export interface IUseProgressBarPostion {
  position: number;
  paused?: boolean;
  duration?: number;
}

export const useProgressBarPosition = ({
  position,
  paused,
  duration,
}: IUseProgressBarPostion) => {
  let lastPositionRef = useRef(position);
  //ms of the position
  const [currentPosition, setCurrentPosition] = useState(position);

  useEffect(() => {
    if (position !== lastPositionRef.current) {
      setCurrentPosition(position);
    }
    if (!paused) {
      const interval = setInterval(() => {
        setCurrentPosition((pos) => (pos += 300));
      }, 300);

      return () => clearInterval(interval);
    }
  }, [paused, position, duration]);

  return [currentPosition];
};
