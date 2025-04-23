"use client"

import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { MdArrowDownward } from "react-icons/md";
import { IoLogoGithub } from "react-icons/io";
import { ImLinkedin2 } from "react-icons/im";
import { BsTwitterX } from "react-icons/bs";
import { IoLogoInstagram } from "react-icons/io5";
import { cn } from "@/lib/utils"

export function HeroSection() {
  const words = useMemo(() => ["Designer", "Developer"], [])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [typedText, setTypedText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    const currentWord = words[currentWordIndex]

    if (!isDeleting && typedText.length < currentWord.length) {
      timeout = setTimeout(() => {
        setTypedText(currentWord.slice(0, typedText.length + 1))
      }, 120)
    } else if (isDeleting && typedText.length > 0) {
      timeout = setTimeout(() => {
        setTypedText(currentWord.slice(0, typedText.length - 1))
      }, 25)
    } else if (!isDeleting && typedText.length === currentWord.length) {
      timeout = setTimeout(() => setIsDeleting(true), 350)
    } else if (isDeleting && typedText.length === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false)
        setCurrentWordIndex((prev) => (prev + 1) % words.length)
      }, 120)
    }

    return () => clearTimeout(timeout)
  }, [typedText, isDeleting, currentWordIndex, words])

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      id="home"
      className="mx-auto relative min-h-screen flex flex-col justify-center items-center pt-16 pb-0"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-pink-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-4">
          <p className="inline-block rounded-full px-3 py-1 text-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">
          Hello, I&apos;m
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4">
            Abhinav Kumar Choudhary
          </h1>
          <div className="h-8 mb-6">
            <h2 className="text-xl md:text-2xl text-purple-300">
              {typedText}
              <span
                className={cn(
                  "ml-1",
                  showCursor ? "opacity-100" : "opacity-0"
                )}
              >
                |
              </span>
            </h2>
          </div>
          <p className="max-w-3xl text-muted-foreground text-xl mb-8">
            I design and develop beautiful, functional, and user-centered websites. 
          </p>

          <div className="flex flex-col sm:flex-row gap-5 mb-8">
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

          <div className="flex space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-purple-500/10 hover:text-purple-400"
            >
              <a href="https://github.com/Abhi1264" target="_blank" rel="noopener noreferrer">
              <IoLogoGithub className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-purple-500/10 hover:text-purple-400"
            >
              <a href="https://www.linkedin.com/in/abhinav-kumar-choudhary-784062288/" target="_blank" rel="noopener noreferrer">
              <ImLinkedin2 className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-purple-500/10 hover:text-purple-400"
            >
              <a href="https://x.com/akc1264" target="_blank" rel="noopener noreferrer">
              <BsTwitterX className="h-5 w-5" />
              <span className="sr-only">X</span>
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-purple-500/10 hover:text-purple-400"
            >
              <a href="https://www.instagram.com/poetry_aficionado/" target="_blank" rel="noopener noreferrer">
              <IoLogoInstagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
              </a>
            </Button>
          </div>
        </div>
      </div>

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
    </section>
  )
}
