import React, { useEffect, useRef } from "react";

type ScrollerProps = {
  className?: string;
  children: React.ReactNode;
  index: number;
};

export const Scroller = ({ className, children, index }: ScrollerProps) => {
  useEffect(() => {
    if (index < 0 || index >= React.Children.toArray(children).length) {
      return;
    }

    if (divRef.current) {
      const child = divRef.current.querySelector(
        `:scope > *:nth-child(${index + 1})`,
      );
      if (child) {
        (child as HTMLElement).scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [index]);

  // Create a useRef that contains the refs of each child
  const divRef = useRef<HTMLDivElement>(null);

  // Initialize refs for each child if not already present

  return (
    <div
      className={`${className ?? ""} flex h-[calc(100vh-41px)] w-full flex-col items-center overflow-hidden`}
      style={
        {
          // scrollbarWidth: "none",
          // msOverflowStyle: "none",
        }
      }
      ref={divRef}
    >
      {children}
    </div>
  );
};
