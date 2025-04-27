"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { MdArrowDownward } from "react-icons/md";
import { IoLogoGithub } from "react-icons/io";
import { ImLinkedin2 } from "react-icons/im";
import { BsTwitterX } from "react-icons/bs";
import { IoLogoInstagram } from "react-icons/io5";
import { cn } from "@/lib/utils";
import Particles from "./particles";

const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/Abhi1264",
    icon: IoLogoGithub,
    srText: "GitHub",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/abhinav-kumar-choudhary-784062288/",
    icon: ImLinkedin2,
    srText: "LinkedIn",
  },
  {
    name: "X",
    url: "https://x.com/akc1264",
    icon: BsTwitterX,
    srText: "X",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/poetry_aficionado/",
    icon: IoLogoInstagram,
    srText: "Instagram",
  },
];

const SocialLinks = () => {
  return (
    <div className="flex space-x-4">
      {socialLinks.map((link) => (
        <Button
          key={link.name}
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-purple-500/10 hover:text-purple-400"
          asChild
        >
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.srText}
          >
            <link.icon className="h-5 w-5" />
            <span className="sr-only">{link.srText}</span>
          </a>
        </Button>
      ))}
    </div>
  );
};

const MemoizedSocialLinks = React.memo(SocialLinks);

const ScrollDownButton = React.memo(() => (
  <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full text-purple-400 hover:bg-purple-500/10"
      onClick={() =>
        document
          .getElementById("about")
          ?.scrollIntoView({ behavior: "smooth" })
      }
    >
      <MdArrowDownward className="h-6 w-6" />
      <span className="sr-only">Scroll Down</span>
    </Button>
  </div>
));

ScrollDownButton.displayName = "ScrollDownButton";

const ActionButtons = React.memo(() => (
  <div className="flex gap-5 mb-8">
    <Button
      className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer hover:scale-105 transition-all duration-200"
      size="lg"
      onClick={() =>
        document
          .getElementById("projects")
          ?.scrollIntoView({ behavior: "smooth" })
      }
    >
      View My Work
    </Button>
    <Button
      variant="outline"
      className="border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 cursor-pointer hover:scale-105 transition-all duration-200"
      size="lg"
      onClick={() =>
        document
          .getElementById("contact")
          ?.scrollIntoView({ behavior: "smooth" })
      }
    >
      Contact Me
    </Button>
  </div>
));

ActionButtons.displayName = "ActionButtons";

export function HeroSection() {
  const words = useMemo(() => ["Designer", "Developer", "Poet"], []);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentWord = words[currentWordIndex];

    if (!isDeleting && typedText.length < currentWord.length) {
      timeout = setTimeout(() => {
        setTypedText(currentWord.slice(0, typedText.length + 1));
      }, 120);
    } else if (isDeleting && typedText.length > 0) {
      timeout = setTimeout(() => {
        setTypedText(currentWord.slice(0, typedText.length - 1));
      }, 50);
    } else if (!isDeleting && typedText.length === currentWord.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1000);
    } else if (isDeleting && typedText.length === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }, 120);
    }

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, currentWordIndex, words]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="mx-auto relative min-h-screen flex flex-col justify-center items-center pt-16 pb-0"
    >
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#eeeeee", "#eeeeee"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
          className="w-full h-full"
        />
      </div>

      <div className="absolute inset-0 pointer-events-none z-1">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/30 rounded-full blur-[100px] opacity-50" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-pink-600/20 rounded-full blur-[100px] opacity-50" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col justify-center items-center h-full">
        <div className="flex flex-col items-center text-center space-y-4">
          <p className="inline-block rounded-full px-3 py-1 text-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">
            Hello, I&apos;m
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tighter mb-4">
            Abhinav Kumar Choudhary
          </h1>
          <div className="h-8 mb-6">
            {" "}
            {/* Increased height for better spacing */}
            <h2 className="text-xl md:text-2xl text-purple-300">
              {typedText}
              <span
                className={cn("ml-1", showCursor ? "opacity-100" : "opacity-0")}
              >
                |
              </span>
            </h2>
          </div>
          <p className="max-w-3xl text-muted-foreground text-xl mb-8">
            I design and develop beautiful, functional, and user-centered
            websites. I am also a poet and love to write poetry in my free time
            which you can read on my instagram.
          </p>

          <ActionButtons />
          <MemoizedSocialLinks />
        </div>
      </div>

      <ScrollDownButton />
    </section>
  );
}
