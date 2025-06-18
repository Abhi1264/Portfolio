import Image from "next/image";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

const education = [
  {
    degree: "Class X - ICSE",
    institution: "St. Thomas School, Dhurwa, Ranchi",
    period: "2009 - 2021",
    image: "/stthomas.jpg",
    description:
      "Completed Class X with a strong academic record and a keen interest in Science and Mathematics. Involved in various school activities and national olympiads competitions.",
    achievements: [
      "Scored 97.5%: City Rank 10",
      "6 times International Mathematics Olympiad Medalist",
      "5 times National Science Olympiad Medalist",
    ],
  },
  {
    degree: "Class XII - CBSE",
    institution: "Jawahar Vidya Mandir, Shyamali, Ranchi",
    period: "2021 - 2023",
    image: "/jvmshyamali.jpg",
    description:
      "Completed Class XII with a focus on Science, achieving a strong foundation in Physics, Chemistry, and Mathematics. Actively participated in extracurricular activities and leadership roles.",
    achievements: [
      "Scored 92%",
      "1st Runner Up in Biannual Science Exhibition",
    ],
  },
  {
    degree: "Bachelor of Technology in Electronics & Communication Engineering",
    institution: "Birla Institute of Technology, Mesra, Ranchi",
    period: "2023 - 2027",
    image: "/bitmesra.webp",
    description:
      "Pursuing a degree in Electronics and Communication Engineering with a focus on Signal Processing and Deep Learning. Engaged in various projects and research activities.",
    achievements: [
      "General Secretary, EDC",
      "Design Head, IET",
      "Design Head, ECE Society",
      "Technical and Design Head, Literary Society",
    ],
  },
];

export function EducationSection() {
  return (
    <section id="education" className="py-20 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/2 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Education
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full mb-8" />
          <p className="max-w-5xl text-muted-foreground">
            My academic background and qualifications.
          </p>
        </div>

        <div className="grid mt-12 relative">
          {education.map((edu, index) => (
            <React.Fragment key={index}>
              <Card
                key={index}
                className="bg-purple-950/10 border border-purple-500/40 overflow-hidden relative"
              >
                <CardContent className="p-6 flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{edu.degree}</h3>
                        <p className="text-purple-400 mb-2">
                          {edu.institution}
                        </p>
                        <Badge
                          variant="outline"
                          className="border-purple-500/50 text-purple-300"
                        >
                          {edu.period}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {edu.description}
                    </p>
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm text-purple-300">
                        Achievements:
                      </h4>
                      <ul className="list-disc list-inside text-muted-foreground text-sm">
                        {edu.achievements.map((achievement, i) => (
                          <li key={i}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="md:w-1/3 flex-shrink-0">
                    <Image
                      src={edu.image}
                      alt={`${edu.institution} logo`}
                      width={300}
                      height={200}
                      className="rounded-lg object-cover w-full h-48 md:h-full"
                    />
                  </div>
                </CardContent>
              </Card>
              {index < education.length - 1 && (
                <div className="flex flex-col items-center justify-center">
                  <div className="h-2 w-4 rounded-b-full bg-purple-500/50"></div>
                  <div className="h-10 w-0.5 bg-purple-500/50" />
                  <div className="h-2 w-4 rounded-t-full bg-purple-500/50"></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
