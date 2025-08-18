import React, { useEffect, useRef } from "react";

type ScrollerProps = {
  className: string;
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
        });
      }
    }
  }, [index]);

  // Create a useRef that contains the refs of each child
  const divRef = useRef<HTMLDivElement>(null);

  // Initialize refs for each child if not already present

  return (
    <div
      className={
        "h-680 hide-scrollbar flex w-full snap-y snap-mandatory flex-col items-center overflow-scroll " +
        className
      }
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
      ref={divRef}
    >
      {children}
    </div>
  );
};
