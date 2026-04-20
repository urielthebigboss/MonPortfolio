import React from "react";
import { motion } from "framer-motion";
import { useSound } from "../hooks/useSound";

interface Props {
  items: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}

export const SubCategoryNav: React.FC<Props> = ({
  items,
  active,
  onChange,
}) => {
  const { playSound } = useSound();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex items-center justify-center gap-4 mt-8"
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            playSound("click");
            onChange(item.id);
          }}
          onMouseEnter={() => playSound("hover")}
          className={`relative px-8 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 border ${
            active === item.id
              ? "border-emerald-500 text-emerald-600 bg-emerald-50/50"
              : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 bg-white/40"
          }`}
        >
          {item.label}
          {active === item.id && (
            <motion.div
              layoutId="subcategory-indicator"
              className="absolute inset-0 rounded-full border-2 border-emerald-500"
              transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
            />
          )}
        </button>
      ))}
    </motion.div>
  );
};
