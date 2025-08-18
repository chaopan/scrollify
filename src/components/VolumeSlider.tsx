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
  const [internalValue, setInternalValue] = useState(value ?? 0.5);
  const [isSliderOpen, setIsSliderOpen] = useState(false);

  // Keep internal value in sync with prop
  useEffect(() => {
    if (typeof value === "number") {
      setInternalValue(value);
    }
  }, [value]);

  const handleSpeakerClick = () => {
    //toggle slider open
    setIsSliderOpen(!isSliderOpen);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setInternalValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className={className + " group flex flex-col self-start text-center"}>
      <button onClick={handleSpeakerClick}>
        <SpeakerSimpleHighIcon weight="duotone" />
      </button>
      <div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={internalValue}
          onChange={handleChange}
          disabled={disabled}
          aria-label="Volume"
          className={`_volume_slider h-200 invisible group-hover:visible`}
          style={{
            direction: "rtl",
            writingMode: "vertical-lr",
          }}
        />
      </div>
    </div>
  );
};

export default VolumeSlider;
