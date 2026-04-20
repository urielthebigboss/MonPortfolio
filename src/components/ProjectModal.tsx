import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "../types/project";
import { useSound } from "../hooks/useSound";

interface Props {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<Props> = ({ project, onClose }) => {
  const { playSound } = useSound();

  const handleClose = useCallback(() => {
    playSound("modal-close");
    onClose();
  }, [onClose, playSound]);

  useEffect(() => {
    if (project) {
      playSound("modal-open");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [project, playSound]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && project) handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [project, handleClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          onClick={handleClose}
        >
          {/* Backdrop with blur */}
          <motion.div
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(20px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            className="absolute inset-0 bg-white/70"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl shadow-gray-300/50 border border-gray-100"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 z-10 p-2 rounded-full bg-gray-100/80 backdrop-blur-sm hover:bg-gray-200 transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8 sm:p-12">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                      {project.title}
                    </h2>
                    {project.isPrivate && (
                      <span className="text-blue-600">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                        </svg>
                      </span>
                    )}
                  </div>
                  {project.subtitle && (
                    <p className="text-lg text-gray-500">{project.subtitle}</p>
                  )}
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-sm font-medium text-gray-500 tracking-wider uppercase">
                      Par {project.author}
                    </span>
                    <span className="text-emerald-600 text-xl">∞</span>
                  </div>
                </div>

                {project.links && project.links.length > 0 && (
                  <a
                    href={project.links[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    Links
                  </a>
                )}
              </div>

              {/* Technologies */}
              <div className="mb-10">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                  Technologie utilisé
                </h3>
                <div className="flex items-center gap-4">
                  {project.technologies.map((tech) => (
                    <div
                      key={tech.name}
                      className="flex flex-col items-center gap-1 group"
                    >
                      <span className="text-3xl transition-transform duration-300 group-hover:scale-110">
                        {tech.icon}
                      </span>
                      <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {tech.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Presentation / Gallery */}
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
                  Presentation
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {project.images.map((img, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <img
                        src={img}
                        alt={`${project.title} - ${idx + 1}`}
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Description & Highlights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {project.description}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Highlights
                  </h3>
                  <ul className="space-y-3">
                    {project.highlights.map((highlight, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.08 }}
                        className="flex items-center gap-3"
                      >
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#2563EB"
                            strokeWidth="3"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <span className="text-gray-700 text-sm">
                          {highlight}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
