import { Card, CardContent } from "@/components/ui/card"
import { Code, Layers, PenTool } from "lucide-react"

export function AboutSection() {
  return (
    <section id="about" className="py-20 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">About Me</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full mb-8" />
          <p className="max-w-5xl text-muted-foreground text-justify">
            I am a passionate UI/UX designer and frontend developer working with the sole purpose of creating
            beautiful, functional, and user-centered digital experiences. My journey began in graphic design, but I quickly fell in love with the world of code, where I could bring my designs to life. Today, I work at the intersection of design and development, creating cohesive digital experiences from concept to implementation.
            <br />
            <br />
            I am always eager to learn and grow, and I strive to stay updated with the latest trends and technologies in the industry. My goal is to create products that not only look good but also provide a seamless user experience. I am excited to take on new challenges and collaborate with like-minded individuals who share my passion for design and development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="bg-black/50 border border-purple-500/20 hover:border-purple-500/40 transition-colors group">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                <PenTool className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">UI/UX Design</h3>
              <p className="text-muted-foreground">
                I create intuitive user experiences and visually appealing interfaces that engage and delight users.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border border-purple-500/20 hover:border-purple-500/40 transition-colors group">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                <Code className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Development</h3>
              <p className="text-muted-foreground">
                I transform designs into responsive, accessible code that performs well across all devices.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border border-purple-500/20 hover:border-purple-500/40 transition-colors group">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                <Layers className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">End-to-End</h3>
              <p className="text-muted-foreground">
                I handle the entire process from concept to deployment, ensuring a cohesive and polished final product.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
