import React, { useState, useEffect } from "react";

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
  step = 0.01,
  className = "",
  disabled = false,
}) => {
  const [internalValue, setInternalValue] = useState(value ?? 0.5);

  // Keep internal value in sync with prop
  useEffect(() => {
    if (typeof value === "number") {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setInternalValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={internalValue}
      onChange={handleChange}
      className={className}
      disabled={disabled}
      aria-label="Volume"
      style={{ width: "100px" }}
    />
  );
};

export default VolumeSlider;
