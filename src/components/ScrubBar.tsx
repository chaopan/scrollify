import { useState, useEffect, useRef } from "react";

export const ScrubBar = ({
  paused = true,
  durationMs,
  reset = false,
}: {
  paused: boolean;
  durationMs: number;
  reset?: boolean;
}) => {
  const [key, setKey] = useState(0);
  const animationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reset) {
      setKey((prev) => prev + 1);
    }
  }, [reset]);

  return (
    <div className="h-4 w-full overflow-hidden bg-gray-100">
      <div
        key={key}
        ref={animationRef}
        className="h-4 origin-left bg-blue-600"
        style={{
          width: "100%",
          transform: "scaleX(0)",
          animation: `scrubAnimation ${durationMs}ms linear forwards`,
          animationPlayState: paused ? "paused" : "running",
        }}
      ></div>
      <style>
        {`
          @keyframes scrubAnimation {
            from {
              transform: scaleX(0);
            }
            to {
              transform: scaleX(1);
            }
          }
        `}
      </style>
    </div>
  );
};
