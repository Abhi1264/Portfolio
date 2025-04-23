import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap } from "lucide-react"

const education = [
  {
    degree: "Bachelor of Technology in Electronics & Communication Engineering",
    institution: "Birla Institute of Technology, Mesra, Ranchi",
    period: "2023 - 2027",
    description:
      "Pursuing a degree in Electronics and Communication Engineering with a focus on Signal Processing and Deep Learning. Engaged in various projects and research activities.",
    achievements: ["General Secretary, EDC", "Design Head, ECE Society", "Senior Executive Member, IET"],
  },
  {
    degree: "Class XII - CBSE",
    institution: "Jawahar Vidya Mandir, Shyamali, Ranchi",
    period: "2021 - 2023",
    description:
      "Completed Class XII with a focus on Science, achieving a strong foundation in Physics, Chemistry, and Mathematics. Actively participated in extracurricular activities and leadership roles.",
    achievements: ["Scored 92%", "1st Runner Up in Biannual Science Exhibition"],
  },
  {
    degree: "Class X - ICSE",
    institution: "St. Thomas School, Dhurwa, Ranchi",
    period: "2009 - 2021",
    description:
      "Completed Class X with a strong academic record and a keen interest in Science and Mathematics. Involved in various school activities and national olympiads competitions.",
    achievements: ["Scored 97.5%: City Rank 10", "6 times Internation Mathematics Olympiad Medalist", "5 times National Science Olympiad Medalist", ],
  },
]

export function EducationSection() {
  return (
    <section id="education" className="py-20 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">Education</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full mb-8" />
          <p className="max-w-5xl text-muted-foreground">My academic background and qualifications.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mt-12">
          {education.map((edu, index) => (
            <Card key={index} className="bg-black/50 border border-purple-500/20 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{edu.degree}</h3>
                    <p className="text-purple-400 mb-2">{edu.institution}</p>
                    <Badge variant="outline" className="mb-4 border-purple-500/50 text-purple-300">
                      {edu.period}
                    </Badge>
                    <p className="text-muted-foreground mb-4">{edu.description}</p>
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm text-purple-300">Achievements:</h4>
                      <ul className="list-disc list-inside text-muted-foreground text-sm">
                        {edu.achievements.map((achievement, i) => (
                          <li key={i}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
