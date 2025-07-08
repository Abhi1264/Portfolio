"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
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

// Move navItems outside of component to prevent recreation on each render
const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Education", href: "#education" },
  { name: "Works", href: "#works" },
  { name: "Contact", href: "#contact" },
];

// Pure component for Logo to prevent unnecessary re-renders
const Logo = React.memo(() => (
  <Link
    href="/"
    className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
  >
    Abhinav
  </Link>
));

Logo.displayName = "Logo";

// Pure component for UserMenu to prevent unnecessary re-renders
const UserMenu = React.memo(() => {
  const { data: session } = useSession();
  const signInCb = useCallback(
    () => signIn("google", { callbackUrl: "/" }),
    []
  );

  if (!session) {
    return (
      <Button
        variant="outline"
        className="border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 cursor-pointer"
        onClick={signInCb}
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
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

UserMenu.displayName = "UserMenu";

type NavProps = {
  onSectionNav: (href: string) => void;
  renderUser: React.ReactNode;
};

const DesktopNav = React.memo<NavProps>(({ onSectionNav, renderUser }) => (
  <nav className="hidden lg:flex items-center space-x-3">
    {navItems.map((item) =>
      item.href.startsWith("#") ? (
        <button
          key={item.name}
          type="button"
          onClick={() => onSectionNav(item.href)}
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
    {renderUser}
  </nav>
));

DesktopNav.displayName = "DesktopNav";

const MobileNav = React.memo<NavProps & { open: boolean }>(
  ({ onSectionNav, open }) => (
    <div
      className={cn(
        "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
        open ? "max-h-130" : "max-h-0"
      )}
    >
      <nav className="bg-black/80 backdrop-blur-md border-b border-purple-500/40">
        <div className="flex flex-col items-center space-y-4 p-4">
          {navItems.map((item) =>
            item.href.startsWith("#") ? (
              <button
                key={item.name}
                type="button"
                onClick={() => onSectionNav(item.href)}
                className="px-3 py-2 text-lg hover:text-purple-400 transition-colors border-none"
                style={{ background: "none" }}
              >
                {item.name}
              </button>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-2 text-lg hover:text-purple-400 transition-colors"
              >
                {item.name}
              </Link>
            )
          )}
        </div>
      </nav>
    </div>
  )
);

MobileNav.displayName = "MobileNav";

// Debounce utility function
function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const prevScrolledRef = useRef(false);

  // Check if we're on a works page to avoid re-renders during works page transitions
  const isWorksPage = useMemo(() => {
    return pathname?.startsWith("/works");
  }, [pathname]);

  // If we're on a works page, always set the scroll state to true (dark background)
  useEffect(() => {
    if (isWorksPage && !isScrolled) {
      setIsScrolled(true);
    }
  }, [isWorksPage, isScrolled]);

  // Optimized scroll handler with debounce and state update check
  const handleScroll = useCallback(() => {
    // Don't update scroll state on work pages - always stays with dark background
    if (isWorksPage) return;

    const currentlyScrolled = window.scrollY > 10;

    // Only update state if the value actually changes
    if (prevScrolledRef.current !== currentlyScrolled) {
      prevScrolledRef.current = currentlyScrolled;
      setIsScrolled(currentlyScrolled);
    }
  }, [isWorksPage]);

  // Debounced version of the scroll handler to reduce number of calls
  const debouncedHandleScroll = useMemo(
    () => debounce(handleScroll, 10),
    [handleScroll]
  );

  // Add scroll listener only if we're not on a works page
  useEffect(() => {
    if (!isWorksPage) {
      window.addEventListener("scroll", debouncedHandleScroll);
      return () => window.removeEventListener("scroll", debouncedHandleScroll);
    }
    // No need to add/remove listener on works pages
    return undefined;
  }, [debouncedHandleScroll, isWorksPage]);

  const handleSectionNav = useCallback(
    (href: string) => {
      if (pathname !== "/") {
        router.push("/" + href);
      } else {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
      setMobileMenuOpen(false);
    },
    [pathname, router]
  );

  // Create a stable renderUser element that won't change between renders
  const renderUser = useMemo(() => <UserMenu />, []);

  // Hamburger icon for mobile menu - memoized to prevent re-renders
  const hamburgerIcon = useMemo(
    () => (
      <div className="relative w-6 h-6">
        <span
          className={cn(
            "absolute top-1/2 left-0 w-full h-0.5 bg-white transition-transform duration-300",
            mobileMenuOpen ? "rotate-45 translate-y-0" : "-translate-y-1.5"
          )}
        />
        <span
          className={cn(
            "absolute top-1/2 left-0 w-full h-0.5 bg-white transition-transform duration-300",
            mobileMenuOpen ? "-rotate-45 translate-y-0" : "translate-y-1.5"
          )}
        />
      </div>
    ),
    [mobileMenuOpen]
  );

  // Create a stable style for the header that doesn't change between renders
  const headerClassName = useMemo(() => {
    return cn(
      "fixed top-0 z-50 w-full transition-all duration-300",
      isScrolled || isWorksPage
        ? "bg-black/80 backdrop-blur-md"
        : "bg-transparent"
    );
  }, [isScrolled, isWorksPage]);

  // Memoize the entire header to prevent re-renders when content hasn't changed
  return (
    <header className={headerClassName}>
      <div className="container mx-auto flex h-18 items-center justify-between pl-4">
        <Logo />

        <DesktopNav onSectionNav={handleSectionNav} renderUser={renderUser} />

        <div className="flex items-center lg:hidden">
          {renderUser}
          <Button
            variant="ghost"
            size="lg"
            className="text-white"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {hamburgerIcon}
          </Button>
        </div>
      </div>

      <MobileNav
        onSectionNav={handleSectionNav}
        renderUser={renderUser}
        open={mobileMenuOpen}
      />
    </header>
  );
}
