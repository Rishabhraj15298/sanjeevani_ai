"use client";

import React, { useEffect, useState } from "react";

// A simple 'cn' utility function to merge class names
function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

// Changed back to a named export to fix the import/export mismatch
export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "normal", // Changed default speed to "normal"
  pauseOnHover = true,
  className,
}) => {
  const containerRef = React.useRef(null);
  const scrollerRef = React.useRef(null);

  useEffect(() => {
    // Check if items is an array before proceeding
    if (items && Array.isArray(items)) {
      addAnimation();
    }
  }, [items]); // Add 'items' as a dependency

  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      // Only add duplicates if items exist
      if (scrollerContent.length > 0) {
        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true);
          if (scrollerRef.current) {
            scrollerRef.current.appendChild(duplicatedItem);
          }
        });

        getDirection();
        getSpeed();
        setStart(true);
      }
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      // Increased all durations to slow down the animation
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      } else {
        // "slow"
        containerRef.current.style.setProperty("--animation-duration", "120s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden bg-black py-12 md:py-20", // Added padding
        className
      )}
    >
      {/* Added the heading here */}
      <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-10">
        What Our Users Say
      </h2>

      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {/* Added a check to ensure items is an array before mapping */}
        {Array.isArray(items) &&
          items.map((item, idx) => (
            <li
              className="relative w-[350px] max-w-full shrink-0 rounded-2xl border border-neutral-800 bg-neutral-900 px-8 py-6 md:w-[450px]"
              // Use a more robust key, combining name and index
              key={`${item.name}-${idx}`}
            >
              <blockquote>
                <div
                  aria-hidden="true"
                  className="user-select-none pointer-events-none absolute -top-0.5 -left-0.5 -z-1 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
                ></div>
                <span className="relative z-20 text-sm leading-[1.6] font-normal text-white">
                  {item.quote}
                </span>
                <div className="relative z-20 mt-6 flex flex-row items-center">
                  <span className="flex flex-col gap-1">
                    <span className="text-sm leading-[1.6] font-normal text-gray-400">
                      {item.name}
                    </span>
                    <span className="text-sm leading-[1.6] font-normal text-gray-400">
                      {item.title}
                    </span>
                  </span>
                </div>
              </blockquote>
            </li>
          ))}
      </ul>
    </div>
  );
};