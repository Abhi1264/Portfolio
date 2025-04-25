import { Button } from "@/components/ui/button";
import { IoLogoGithub } from "react-icons/io";
import { ImLinkedin2 } from "react-icons/im";
import { BsTwitterX } from "react-icons/bs";
import { IoLogoInstagram } from "react-icons/io5";

export function Footer() {
  return (
    <footer className="py-6 border-t border-purple-500/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left order-2 sm:order-none">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Abhinav Kumar Choudhary. All
              rights reserved.
            </p>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-purple-500/10 hover:text-purple-400"
            >
              <a
                href="https://github.com/Abhi1264"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoLogoGithub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-purple-500/10 hover:text-purple-400"
            >
              <a
                href="https://www.linkedin.com/in/abhinav-kumar-choudhary-784062288/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ImLinkedin2 className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-purple-500/10 hover:text-purple-400"
            >
              <a
                href="https://x.com/akc1264"
                target="_blank"
                rel="noopener noreferrer"
              >
                <BsTwitterX className="h-5 w-5" />
                <span className="sr-only">X</span>
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-purple-500/10 hover:text-purple-400"
            >
              <a
                href="https://www.instagram.com/poetry_aficionado/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoLogoInstagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
