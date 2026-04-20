import React from "react";
import { motion } from "framer-motion";
import type { Category } from "../types/project";
import { useSound } from "../hooks/useSound";

interface Props {
  categories: { id: Category; label: string; icon: string }[];
  active: Category;
  onChange: (cat: Category) => void;
}

export const CategoryNav: React.FC<Props> = ({
  categories,
  active,
  onChange,
}) => {
  const { playSound } = useSound();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center justify-center gap-2 p-2 rounded-full bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-lg shadow-gray-200/20 w-fit mx-auto"
    >
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => {
            playSound("click");
            onChange(cat.id);
          }}
          onMouseEnter={() => playSound("hover")}
          className="relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
        >
          {active === cat.id && (
            <motion.div
              layoutId="category-pill"
              className="absolute inset-0 bg-gray-900 rounded-full"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span
            className={`relative z-10 flex items-center gap-2 ${active === cat.id ? "text-white" : "text-gray-600 hover:text-gray-900"}`}
          >
            <span className="text-base">{cat.icon}</span>
            {cat.label}
          </span>
        </button>
      ))}
    </motion.div>
  );
};
