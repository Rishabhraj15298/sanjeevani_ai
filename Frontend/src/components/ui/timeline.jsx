import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const Timeline = ({ data = [] }) => {
  const ref = useRef(null);           // element whose height we measure
  const containerRef = useRef(null);  // scroll target
  const itemRefs = useRef([]);        // refs for each item (for activation)

  const [height, setHeight] = useState(0);
  const [offsets, setOffsets] = useState([]);      // item Y-offsets (px from container top)
  const [active, setActive] = useState(() => data.map(() => false));

  // keep refs array length in sync
  itemRefs.current = itemRefs.current.slice(0, data.length);

  // Scroll progress mapping: 0 when container top hits viewport top, 1 at container bottom
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // height (px) of the colored vertical line based on progress
  const heightTransform = useTransform(scrollYProgress, (v) => `${v*height}px`);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  // Measure the total height and each item's offset from container top
  useEffect(() => {
    const measure = () => {
      if (!ref.current || !containerRef.current) return;

      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);

      const cRect = containerRef.current.getBoundingClientRect();
      const newOffsets = itemRefs.current.map((el) => {
        if (!el) return Infinity;
        const r = el.getBoundingClientRect();
        return r.top - cRect.top; // px from container top
      });
      setOffsets(newOffsets);
    };

    measure();
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 300); // re-measure after fonts/images
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, [data]);

  // Activate dots as the line passes them
  useEffect(() => {
    if (!height || offsets.length === 0) return;

    const unsub = scrollYProgress.onChange((v) => {
      const progressPx = v * height;
      const threshold = 20; // lights up slightly before the line reaches the item
      const next = offsets.map((off) => off <= progressPx + threshold);

      setActive((prev) =>
        prev.length === next.length && prev.every((p, i) => p === next[i]) ? prev : next
      );
    });

    return () => unsub && unsub();
  }, [height, offsets, scrollYProgress]);

  return (
    <div ref={containerRef} className="w-full bg-black font-sans md:px-10">
      {/* Header */}
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <h2 className="text-lg md:text-5xl mb-4 text-white max-w-4xl">How It Works</h2>
        <p className="text-white text-sm md:text-base max-w-sm">
          A clear guide to how our platform supports your wellbeing.
        </p>
      </div>

      {/* Timeline content (measured area) */}
      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            ref={(el) => (itemRefs.current[index] = el)}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            {/* Left side: dot + desktop title */}
            <div className="sticky top-40 z-40 self-start max-w-xs lg:max-w-sm md:w-full flex flex-col md:flex-row items-center">
              {/* Outer ring (subtle bg on active) */}
              <motion.div
                className="h-10 w-10 absolute left-3 md:left-3 rounded-full flex items-center justify-center"
                animate={{
                  background: active[index] ? "rgba(255,255,255,0.06)" : "transparent",
                }}
                transition={{ duration: 0.35 }}
              >
                {/* Inner dot */}
                <motion.div
                  className="h-4 w-4 rounded-full border border-white p-3"
                  animate={{
                    backgroundColor: active[index] ? "#2DB32D" : "#374151",
                    scale: active[index] ? 1.05 : 1,
                    borderColor: active[index] ? "white" : "#4b5563",
                  }}
                  transition={{ duration: 0.35 }}
                />
              </motion.div>

              <h3 className="hidden md:block text-xl md:pl-32 md:text-5xl font-bold text-white">
                {item.title}
              </h3>
            </div>

            {/* Right side: mobile title + content */}
            <div className="relative pl-32 pr-4 md:pl-32 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-white">
                {item.title}
              </h3>
              <p className="text-white">{item.content}</p>
            </div>
          </div>
        ))}

        {/* Vertical track and animated fill (top → bottom) */}
        <div
          style={{ height: `${height}px` }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px]"
        >
          {/* Track (optional faint line behind the fill) */}
          <div className="absolute inset-0 w-[2px] bg-white/10 rounded-full" />
          {/* Fill */}
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-b from-purple-500 via-blue-500 to-transparent rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
