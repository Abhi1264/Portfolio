"use client";

import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BriefcaseIcon } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const experiences = [
  {
    title: "Graphic Designer",
    company: "Bloom Tide Consulting",
    period: "July 2024 - Feb 2025",
    description:
      "Created visual assets for social media, focusing on branding.",
    skills: ["Figma", "Canva", "Adobe Creative Suite"],
  },
  {
    title: "UI/UX Designer & Frontend Developer",
    company: "Bitotsav'25",
    period: "Feb 2025 - Mar 2025",
    description:
      "Designed and developed user interfaces for web and mobile websites.",
    skills: ["Figma", "React", "Next", "Tailwind CSS", "Shadcn/ui", "Three"],
  },
  {
    title: "SDE Intern",
    company: "Bloom Tide Consulting",
    period: "Feb 2025 - Present",
    description:
      "Developed front-end for a social media platform and led UI/UX redesigns.",
    skills: ["TypeScript", "React", "Tailwind CSS", "Vite"],
  },
];

export function ExperienceSection() {
  const timelineRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of the timeline container
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="experience" className="py-20 relative">
      {/* Background blur */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-pink-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Work Experience
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full mb-8" />
          <p className="max-w-5xl text-muted-foreground">
            My professional journey in design and development.
          </p>
        </div>

        {/* Timeline + Items */}
        <div className="relative mt-12" ref={timelineRef}>
          {/* Scroll-driven timeline line */}
          <motion.div
            className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-purple-500 to-pink-500 z-0"
            style={{
              scaleY,
              transformOrigin: "top",
            }}
          />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <motion.div
                key={i}
                className="relative z-10"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div
                  className={`flex flex-col md:flex-row items-center ${
                    i % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-10 h-10 rounded-full bg-black border-2 border-purple-500 hidden md:flex items-center justify-center">
                    <BriefcaseIcon className="h-4 w-4 text-purple-400" />
                  </div>

                  {/* Card */}
                  <div
                    className={`w-full md:w-1/2 ${
                      i % 2 === 0 ? "md:pr-12" : "md:pl-12"
                    }`}
                  >
                    <Card className="bg-black/50 border border-purple-500/40 overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold">{exp.title}</h3>
                            <p className="text-purple-400">{exp.company}</p>
                          </div>
                          <Badge
                            variant="outline"
                            className="mt-2 md:mt-0 self-start md:self-center border-purple-500/50 text-purple-300"
                          >
                            {exp.period}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          {exp.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {exp.skills.map((s, idx) => (
                            <Badge
                              key={idx}
                              className="bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
                            >
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="hidden md:block w-1/2" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
