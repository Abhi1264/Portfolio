"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Education", href: "#education" },
  { name: "Projects", href: "#projects" },
  { name: "Works", href: "#works" },
  { name: "Contact", href: "#contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSectionNav = (href: string) => {
    if (pathname !== "/") {
      router.push("/" + href);
    } else {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const UserButton = () => {
    if (!session) {
      return (
        <Button
          variant="outline"
          className="border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 cursor-pointer"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          Sign In
        </Button>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-9 w-9 rounded-full overflow-hidden ring-1 ring-purple-500/20 hover:ring-purple-500/40 transition-all cursor-pointer"
          >
            <Image
              src={session.user?.image || ""}
              alt={session.user?.name || "Profile"}
              className="object-cover"
              fill
              sizes="2.5rem"
              priority
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="flex items-center gap-2 p-2">
            <div className="rounded-full w-8 h-8 overflow-hidden">
              <Image
                src={session.user?.image || ""}
                alt={session.user?.name || "Profile"}
                className="object-cover"
                width={32}
                height={32}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{session.user?.name}</span>
              <span className="text-xs text-muted-foreground">
                {session.user?.email}
              </span>
            </div>
          </div>
          <DropdownMenuItem
            className="text-red-500 cursor-pointer"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-black/80 backdrop-blur-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-18 items-center justify-between pl-4">
        <Link
          href="/"
          className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
          onClick={() => setMobileMenuOpen(false)}
        >
          Abhi.1264
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-3">
          {navItems.map((item) =>
            item.href.startsWith("#") ? (
              <button
                key={item.name}
                type="button"
                onClick={() => handleSectionNav(item.href)}
                className="px-3 py-2 text-base hover:text-purple-400 transition-colors bg-transparent border-none cursor-pointer"
                style={{ background: "none" }}
              >
                {item.name}
              </button>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-2 text-base hover:text-purple-400 transition-colors"
              >
                {item.name}
              </Link>
            )
          )}
          <UserButton />
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center lg:hidden">
          <UserButton />
          <Button
            variant="ghost"
            size="lg"
            className="text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="relative w-6 h-6">
              <span
                className={cn(
                  "absolute top-1/2 left-0 w-full h-0.5 bg-white transition-transform duration-300",
                  mobileMenuOpen
                    ? "rotate-45 translate-y-0"
                    : "-translate-y-1.5"
                )}
              />
              <span
                className={cn(
                  "absolute top-1/2 left-0 w-full h-0.5 bg-white transition-transform duration-300",
                  mobileMenuOpen
                    ? "-rotate-45 translate-y-0"
                    : "translate-y-1.5"
                )}
              />
            </div>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
          mobileMenuOpen ? "max-h-120" : "max-h-0"
        )}
      >
        <nav className="bg-black/80 backdrop-blur-md border-b border-purple-500/40">
          <div className="flex flex-col space-y-5 p-4 transform transition-transform duration-300 ease-in-out">
            {navItems.map((item) =>
              item.href.startsWith("#") ? (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    handleSectionNav(item.href);
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-2 text-lg hover:text-purple-400 transition-colors bg-transparent border-none"
                  style={{ background: "none" }}
                >
                  {item.name}
                </button>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 text-lg hover:text-purple-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
