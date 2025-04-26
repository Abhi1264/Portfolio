"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FiExternalLink, FiGithub } from "react-icons/fi";

const projects = [
  {
    title: "Bitotsav'25 Website",
    description:
      "Responsive website for BIT Mesra's annual techno-cultural fest, featuring event details, registration, and community engagement.",
    image: "/bitotsav.png",
    tags: ["Next", "Figma", "Tailwind CSS", "Shadcn/ui", "Three"],
    liveLink: "https://www.bitotsav.com/",
    githubLink: "https://github.com/bitotsav-fest/website",
    featured: true,
    type: "design-dev",
  },
  {
    title: "EDC BIT Mesra Website",
    description:
      "Responsive website for the Entrepreneurship Development Cell of BIT Mesra, showcasing events, resources, and community engagement.",
    tags: ["React", "Figma", "Tailwind CSS", "Vite"],
    image: "/edclogo3d.png",
    liveLink: "https://edcbitmesra.in/",
    githubLink: "https://github.com/EDC-BITM/EDC-BITM",
    featured: false,
    type: "design-dev",
  },
  {
    title: "E-Summtit'25 Website",
    description:
      "Responsive website for E-Summit 2025, featuring event details, registration, and community engagement.",
    image: "/esummit.png",
    tags: ["React", "Tailwind CSS", "Figma"],
    liveLink: "https://esummit.edcbitmesra.in/",
    githubLink: "https://github.com/EDC-BITM/E-Summit-2025",
    featured: true,
    type: "design-dev",
  },
  {
    title: "Portfolio Website",
    description:
      "A personal portfolio website showcasing my design and development work, built with Next.js and Tailwind CSS.",
    image: "/portfolio.jpg",
    tags: ["Next", "Tailwind CSS", "Email JS", "Shadcn/ui"],
    liveLink: "https://abhi1264.vercel.app/",
    githubLink: "https://github.com/Abhi1264/Portfolio",
    featured: false,
    type: "development",
  },
];

export function ProjectsSection() {
  const [filter, setFilter] = useState("all");

  const filteredProjects =
    filter === "all"
      ? projects
      : filter === "featured"
      ? projects.filter((p) => p.featured)
      : filter === "design"
      ? projects.filter((p) => p.type === "design" || p.type === "design-dev")
      : filter === "development"
      ? projects.filter(
          (p) => p.type === "development" || p.type === "design-dev"
        )
      : projects.filter((p) => p.tags.includes(filter));

  return (
    <section id="projects" className="py-20 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
            My Projects
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full mb-8" />
          <p className="max-w-5xl text-muted-foreground">
            A selection of my design and development work.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className={
              filter === "all"
                ? "bg-purple-600 hover:bg-purple-700 text-lg px-6 py-5"
                : "border-purple-500/50 text-purple-300 hover:bg-purple-500/10 cursor-pointer text-lg px-6 py-5"
            }
          >
            All
          </Button>
          <Button
            variant={filter === "featured" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("featured")}
            className={
              filter === "featured"
                ? "bg-purple-600 hover:bg-purple-700 text-lg px-6 py-5"
                : "border-purple-500/50 text-purple-300 hover:bg-purple-500/10 cursor-pointer text-lg px-6 py-5"
            }
          >
            Featured
          </Button>
          <Button
            variant={filter === "design" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("design")}
            className={
              filter === "design"
                ? "bg-purple-600 hover:bg-purple-700 text-lg px-6 py-5"
                : "border-purple-500/50 text-purple-300 hover:bg-purple-500/10 cursor-pointer text-lg px-6 py-5"
            }
          >
            Design
          </Button>
          <Button
            variant={filter === "development" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("development")}
            className={
              filter === "development"
                ? "bg-purple-600 hover:bg-purple-700 text-lg px-6 py-5"
                : "border-purple-500/50 text-purple-300 hover:bg-purple-500/10 cursor-pointer text-lg px-6 py-5"
            }
          >
            Development
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredProjects.map((project, index) => (
            <Card
              key={index}
              className="bg-black/50 border border-purple-500/20 overflow-hidden group"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                  <div className="flex gap-2">
                    {project.type === "development" ||
                    project.type === "design-dev" ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-black/50 border-white/20 backdrop-blur-sm"
                          asChild
                        >
                          <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FiExternalLink className="h-4 w-4 mr-2" />
                            Live
                          </a>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-black/50 border-white/20 backdrop-blur-sm"
                          asChild
                        >
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FiGithub className="h-4 w-4 mr-2" />
                            Code
                          </a>
                        </Button>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
                    <Badge
                      key={i}
                      className="bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
