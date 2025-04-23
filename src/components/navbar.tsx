"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Education", href: "#education" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-black/80 backdrop-blur-md border-b border-purple-500/20"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-18 items-center justify-between pl-4">
        <Link
          href="#home"
          className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
        >
          Abhi.1264
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-3 py-2 text-base hover:text-purple-400 transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <a
            href="https://drive.google.com/file/d/1V8q8yzVHgjv35e1ZuqXOcCn07vWNfF-J/view?usp=sharing"
            target="_blank" rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="ml-4 border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 cursor-pointer"
            >
              Resume
            </Button>
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:bg-purple-500/10"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden p-4 bg-black/80 border-b border-purple-500/20 backdrop-blur-md">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-2 text-base hover:text-purple-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Button
              variant="outline"
              className="text-base py-3 mt-2 border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
            >
              Resume
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
