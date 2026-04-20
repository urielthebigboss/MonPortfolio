import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Category, Project } from "../types/project";
import {
  categories,
  subCategories,
  projects,
  infographicItems,
} from "../data/projects";
import { CircuitBackground } from "../components/CircuitBackground";
import { CategoryNav } from "../components/CategoryNav";
import { SubCategoryNav } from "../components/SubCategoryNav";
import { ProjectCard } from "../components/ProjectCard";
import { ProjectModal } from "../components/ProjectModal";
import { InfographicGallery } from "../components/InfographicGallery";
import Navbar from "../components/Navbar";

export const ProjectsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] =
    useState<Category>("informatique");
  const [activeSubCategory, setActiveSubCategory] =
    useState<string>("en-vedette");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = useMemo(() => {
    return projects.filter(
      (p) =>
        p.category === activeCategory && p.subCategory === activeSubCategory,
    );
  }, [activeCategory, activeSubCategory]);

  const handleCategoryChange = useCallback((cat: Category) => {
    setActiveCategory(cat);
    setActiveSubCategory("en-vedette");
  }, []);

  const categoryColor =
    activeCategory === "informatique"
      ? "text-emerald-500"
      : activeCategory === "infographie"
        ? "text-purple-500"
        : activeCategory === "motion"
          ? "text-amber-500"
          : "text-cyan-500";

  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      <Navbar />

      <CircuitBackground />

      <div className="relative z-10 pt-20 pb-32 px-4 sm:px-8 mt-20">
        {/* Category Navigation */}
        <div className="mb-12">
          <CategoryNav
            categories={categories}
            active={activeCategory}
            onChange={handleCategoryChange}
          />
        </div>

        {/* Title */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Projets{" "}
            <span className={categoryColor}>
              {activeCategory === "informatique"
                ? "informatiques"
                : activeCategory + "s"}
            </span>
          </h1>
        </motion.div>

        {/* Sub-category Navigation */}
        <SubCategoryNav
          items={subCategories}
          active={activeSubCategory}
          onChange={setActiveSubCategory}
        />

        {/* Content */}
        <div className="mt-12 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeCategory === "infographie" ? (
              <motion.div
                key="infographie"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <InfographicGallery items={infographicItems} />
              </motion.div>
            ) : (
              <motion.div
                key={`${activeCategory}-${activeSubCategory}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredProjects.map((project, idx) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={idx}
                    onClick={() => setSelectedProject(project)}
                  />
                ))}

                {filteredProjects.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full text-center py-20"
                  >
                    <p className="text-gray-400 text-lg">
                      Aucun projet dans cette catégorie
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
