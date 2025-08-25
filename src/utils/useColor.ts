import { useEffect, useRef } from "react";
import { prominent } from "color.js";

/**
 * useColorFromImage
 * Extracts two prominent colors from an image and sets them as CSS variables.
 *
 * @param {React.RefObject<HTMLImageElement>} imgRef - Ref to the image element.
 * @param {string} [primaryVar="--color-song-primary"] - CSS variable for the primary color.
 * @param {string} [secondaryVar="--color-song-secondary"] - CSS variable for the secondary color.
 */

export const useColorFromImage = (
  imgRef: HTMLImageElement | null,
  isCurrent?: boolean,
) => {
  useEffect(() => {
    if (!isCurrent) {
      return;
    }
    if (!imgRef) {
      return;
    }

    prominent(imgRef, { amount: 2, format: "hex" }).then((colors) => {
      console.log("setting colors", colors);
      colors[0] &&
        document?.documentElement.style.setProperty(
          "--color-song-primary",
          colors[0] as string,
        );
      colors[1] &&
        document?.documentElement.style.setProperty(
          "--color-song-secondary",
          colors[1] as string,
        );
    });
  }, [imgRef, isCurrent]);
};
