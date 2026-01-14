"use client";
import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FaPaintRoller, FaCode } from "react-icons/fa6";
import { LuPenTool } from "react-icons/lu";

const skills = [
  {
    icon: FaPaintRoller,
    title: "UI/UX Design",
    description:
      "I create intuitive user experiences and visually appealing interfaces that engage and delight users.",
  },
  {
    icon: FaCode,
    title: "Development",
    description:
      "I transform designs into responsive, accessible code that performs well across all devices.",
  },
  {
    icon: LuPenTool,
    title: "Poetry",
    description:
      "I express my thoughts and emotions through the art of poetry, weaving words into beautiful narratives.",
  },
];

// Create a separate card component to handle individual spotlight effects
const SpotlightCard = ({
  skill,
  spotlightColor = "purple-600",
}: {
  skill: (typeof skills)[number];
  spotlightColor?: string;
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <Card
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(0.5)}
      onMouseLeave={() => setOpacity(0)}
      className="bg-black/50 border border-purple-500/40 hover:border-purple-500/60 transition-colors group relative"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      <CardContent className="p-6 flex flex-col items-center text-center relative z-10">
        <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
          <skill.icon className="h-6 w-6 text-purple-400" />
        </div>
        <h3 className="text-xl font-bold mb-2">{skill.title}</h3>
        <p className="text-muted-foreground">{skill.description}</p>
      </CardContent>
    </Card>
  );
};

const AboutSection = ({ spotlightColor = "rgb(147 51 234 / 0.4)" }) => {
  return (
    <section id="about" className="py-20 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl mb-4">
            About Me
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full mb-8" />
          <p className="max-w-5xl text-muted-foreground text-justify">
            I am a passionate UI/UX designer and full-stack developer working
            with the sole purpose of creating beautiful, functional, and
            user-centered digital experiences. My journey began in graphic
            design, but I quickly fell in love with the world of code, where I
            could bring my designs to life. Today, I work at the intersection of
            design and development, creating cohesive digital experiences from
            concept to implementation. Beyond the digital realm, I also find
            creative expression through the art of poetry, weaving words to
            capture thoughts and emotions.
            <br />
            <br />I am always eager to learn and grow, and I strive to stay
            updated with the latest trends and technologies in the industry. My
            goal is to create products that not only look good but also provide
            a seamless user experience. I am excited to take on new challenges
            and collaborate with like-minded individuals who share my passion
            for design, development, and creative expression.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {skills.map((skill, index) => (
            <SpotlightCard
              key={index}
              skill={skill}
              spotlightColor={spotlightColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
