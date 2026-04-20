import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Project } from "../types/project";
import { useSound } from "../hooks/useSound";

interface Props {
  project: Project;
  index: number;
  onClick: () => void;
}

export const ProjectCard: React.FC<Props> = ({ project, index, onClick }) => {
  const { playSound } = useSound();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setIsHovered(true);
        playSound("hover");
      }}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        playSound("click");
        onClick();
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg shadow-gray-200/30 border border-gray-100 transition-shadow duration-500 group-hover:shadow-2xl group-hover:shadow-emerald-500/10">
        {/* Image container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <motion.img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover"
            animate={{
              scale: isHovered ? 1.08 : 1,
              filter: isHovered ? "brightness(1.05)" : "brightness(1)",
            }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Overlay gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
            animate={{ opacity: isHovered ? 1 : 0.6 }}
          />

          {/* Glow effect on hover */}
          <motion.div
            className="absolute inset-0 bg-emerald-500/10"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">
                {project.title}
              </h3>
            </div>
            {project.isPrivate && (
              <span className="text-gray-400">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
            )}
          </div>

          {/* Author */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs font-medium text-gray-500 tracking-wider uppercase">
              {project.author}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
