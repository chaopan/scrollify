import React, { useState, useEffect } from "react";
import { SpeakerSimpleHighIcon } from "@phosphor-icons/react";

type VolumeSliderProps = {
  value?: number; // 0-1
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
};

export const VolumeSlider: React.FC<VolumeSliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.02,
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSpeakerClick = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (onChange) {
      onChange(newValue);
    }
  };

  // Close slider when clicking outside (optional enhancement)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        !(event.target as Element).closest(".volume-slider-container")
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className={`${className} volume-slider-container self-start p-10`}>
      <div
        role="region"
        aria-label="Volume control"
        className={`frosted-glass-1 flex cursor-pointer flex-col self-start rounded-full p-5 text-center ${
          isOpen ? "gap-y-10 pb-8" : ""
        }`}
      >
        <button
          onClick={handleSpeakerClick}
          className="cursor-pointer bg-transparent"
          aria-label={isOpen ? "Hide volume slider" : "Show volume slider"}
        >
          <SpeakerSimpleHighIcon weight="bold" />
        </button>
        <div
          className={`overflow-hidden ${isOpen ? "h-200" : "h-0"}`}
          style={{ transition: "height 0.1s ease" }}
        >
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            aria-label="Volume"
            className="volume-slider h-200 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default VolumeSlider;
