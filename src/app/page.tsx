import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import { SkillsSection } from "@/components/skills-section";
import { ExperienceSection } from "@/components/experience-section";
import { EducationSection } from "@/components/education-section";
import { ProjectsSection } from "@/components/projects-section";
import { WorksSection } from "@/components/works-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-neutral-100">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <ProjectsSection />
        <EducationSection />
        <WorksSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
