import React, { useState, useRef, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import type { InfographicItem } from "../types/project";
import { useSound } from "../hooks/useSound";

interface Props {
  items: InfographicItem[];
}

const COLUMN_WIDTH = 320;
const GAP = 24;

export const InfographicGallery: React.FC<Props> = ({ items }) => {
  const { playSound } = useSound();
  const containerRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<InfographicItem | null>(
    null,
  );

  const filters = ["all", ...Array.from(new Set(items.map((i) => i.category)))];

  const filteredItems =
    filter === "all" ? items : items.filter((item) => item.category === filter);

  // Distribute items into columns for masonry
  const distributeColumns = (items: InfographicItem[], numCols: number) => {
    const cols: InfographicItem[][] = Array.from({ length: numCols }, () => []);
    const heights = new Array(numCols).fill(0);

    items.forEach((item) => {
      const shortestCol = heights.indexOf(Math.min(...heights));
      cols[shortestCol].push(item);
      heights[shortestCol] += (item.height / item.width) * COLUMN_WIDTH + GAP;
    });

    return cols;
  };

  const [columns, setColumns] = useState<InfographicItem[][]>([]);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      const numCols = width < 640 ? 1 : width < 1024 ? 2 : 3;
      setColumns(distributeColumns(filteredItems, numCols));
    };
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, [filteredItems]);

  return (
    <div className="w-full">
      {/* Filter tabs */}
      <motion.div
        className="flex justify-center gap-3 mb-10 flex-wrap"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => {
              playSound("click");
              setFilter(f);
            }}
            onMouseEnter={() => playSound("hover")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              filter === f
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                : "bg-white/60 text-gray-600 hover:bg-white border border-gray-200"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* Masonry Grid */}
      <div
        ref={containerRef}
        className="flex justify-center gap-6"
        style={{ perspective: 1000 }}
      >
        {columns.map((column, colIdx) => (
          <div
            key={colIdx}
            className="flex flex-col gap-6"
            style={{ width: COLUMN_WIDTH }}
          >
            {column.map((item, idx) => (
              <MasonryItem
                key={item.id}
                item={item}
                index={colIdx * 10 + idx}
                onClick={() => {
                  playSound("click");
                  setSelectedImage(item);
                }}
                onHover={() => playSound("hover")}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/90 backdrop-blur-xl"
          onClick={() => setSelectedImage(null)}
        >
          <motion.img
            src={selectedImage.src}
            alt={selectedImage.alt}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="max-w-full max-h-full rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </div>
  );
};

const MasonryItem: React.FC<{
  item: InfographicItem;
  index: number;
  onClick: () => void;
  onHover: () => void;
}> = ({ item, index, onClick, onHover }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isHovered, setIsHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: (index % 3) * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative group cursor-pointer"
      onMouseEnter={() => {
        setIsHovered(true);
        onHover();
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <motion.div
        animate={{
          rotateX: isHovered ? 2 : 0,
          rotateY: isHovered ? -2 : 0,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl group-hover:shadow-emerald-500/20 transition-shadow duration-500"
      >
        <div
          style={{
            aspectRatio: `${item.width} / ${item.height}`,
          }}
          className="relative overflow-hidden"
        >
          <motion.img
            src={item.src}
            alt={item.alt}
            className="w-full h-full object-cover"
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            loading="lazy"
          />

          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
            animate={{ opacity: isHovered ? 1 : 0 }}
          />

          {/* Glow border */}
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-emerald-400/0"
            animate={{
              borderColor: isHovered
                ? "rgba(52, 211, 153, 0.5)"
                : "rgba(52, 211, 153, 0)",
            }}
          />

          {/* Tags */}
          <motion.div
            className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          >
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-white/20 backdrop-blur-md text-white rounded-full"
              >
                #{tag}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};
