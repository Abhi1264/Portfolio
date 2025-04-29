import Image from "next/image";
export function SkillsSection() {
  const images = [
    { name: "AfterEffects", src: "/Skills-logos/AfterEffects.svg" },
    // { name: "AlpineJS", src: "/Skills-logos/AlpineJS.svg" },
    { name: "AndroidStudio", src: "/Skills-logos/AndroidStudio.svg" },
    // { name: "Angular", src: "/Skills-logos/Angular.svg" },
    { name: "AWS", src: "/Skills-logos/AWS.svg" },
    { name: "Azure", src: "/Skills-logos/Azure.svg" },
    { name: "Bash", src: "/Skills-logos/Bash.svg" },
    { name: "Bootstrap", src: "/Skills-logos/Bootstrap.svg" },
    { name: "BSD", src: "/Skills-logos/BSD.svg" },
    { name: "C", src: "/Skills-logos/C.svg" },
    { name: "C++", src: "/Skills-logos/C++.svg" },
    { name: "C#", src: "/Skills-logos/CSharp.svg" },
    { name: "CSS", src: "/Skills-logos/CSS.svg" },
    { name: "Django", src: "/Skills-logos/Django.svg" },
    { name: "Docker", src: "/Skills-logos/Docker.svg" },
    // { name: "DotNET", src: "/Skills-logos/DotNET.svg" },
    // { name: "DynamoDB", src: "/Skills-logos/DynamoDB.svg" },
    { name: "Express", src: "/Skills-logos/Express.svg" },
    { name: "Figma", src: "/Skills-logos/Figma.svg" },
    { name: "Flutter", src: "/Skills-logos/Flutter.svg" },
    { name: "Framer", src: "/Skills-logos/Framer.svg" },
    { name: "Git", src: "/Skills-logos/Git.svg" },
    { name: "GitHub", src: "/Skills-logos/GitHub.svg" },
    { name: "GitLab", src: "/Skills-logos/GitLab.svg" },
    { name: "HTML", src: "/Skills-logos/HTML.svg" },
    { name: "Illustrator", src: "/Skills-logos/Illustrator.svg" },
    { name: "Java", src: "/Skills-logos/Java.svg" },
    { name: "JavaScript", src: "/Skills-logos/JavaScript.svg" },
    { name: "JQuery", src: "/Skills-logos/JQuery.svg" },
    { name: "Linux", src: "/Skills-logos/Linux.svg" },
    { name: "MongoDB", src: "/Skills-logos/MongoDB.svg" },
    { name: "MySQL", src: "/Skills-logos/MySQL.svg" },
    // { name: "NestJS", src: "/Skills-logos/NestJS.svg" },
    { name: "Netlify", src: "/Skills-logos/Netlify.svg" },
    { name: "NextJS", src: "/Skills-logos/NextJS.svg" },
    { name: "NodeJS", src: "/Skills-logos/NodeJS.svg" },
    // { name: "NuxtJS", src: "/Skills-logos/NuxtJS.svg" },
    { name: "Postman", src: "/Skills-logos/Postman.svg" },
    { name: "Photoshop", src: "/Skills-logos/Photoshop.svg" },
    { name: "PHP", src: "/Skills-logos/PHP.svg" },
    { name: "Premiere", src: "/Skills-logos/Premiere.svg" },
    { name: "Python", src: "/Skills-logos/Python.svg" },
    // { name: "PyTorch", src: "/Skills-logos/PyTorch.svg" },
    // { name: "R", src: "/Skills-logos/R.svg" },
    { name: "React", src: "/Skills-logos/React.svg" },
    { name: "Redux", src: "/Skills-logos/Redux.svg" },
    // { name: "Ruby", src: "/Skills-logos/Ruby.svg" },
    // { name: "SASS", src: "/Skills-logos/SASS.svg" },
    // { name: "SolidJS", src: "/Skills-logos/SolidJS.svg" },
    // { name: "Spring", src: "/Skills-logos/Spring.svg" },
    { name: "SQLite", src: "/Skills-logos/SQLite.svg" },
    { name: "StackOverFlow", src: "/Skills-logos/StackOverFlow.svg" },
    // { name: "Swift", src: "/Skills-logos/Swift.svg" },
    { name: "TailwindCSS", src: "/Skills-logos/TailwindCSS.svg" },
    { name: "Typescript", src: "/Skills-logos/Typescript.svg" },
    // { name: "VueJS", src: "/Skills-logos/VueJS.svg" },
    { name: "Webflow", src: "/Skills-logos/Webflow.svg" },
    // { name: "WindiCSS", src: "/Skills-logos/WindiCSS.svg" },
    { name: "WordPress", src: "/Skills-logos/Wordpress.svg" },
    { name: "XD", src: "/Skills-logos/XD.svg" },
  ];

  // Reverse the images array for the reverse animation
  const reversedImages = [...images].reverse();

  // Define image dimensions
  const imageWidth = 100; // Adjust as needed
  const imageHeight = 100; // Adjust as needed

  return (
    <>
      {/* Forward Scrolling Animation Section */}
      <div className="relative pt-20">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
            Skills & Technologies
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full mb-8" />
          <p className="max-w-5xl text-muted-foreground">
            A collection of tools and technologies I have worked with.
          </p>
        </div>
        <div className="absolute top-0 left-0 h-full w-36 sm:w-56 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 h-full w-36 sm:w-56 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
        {/* Scrolling Container */}
        <div className="overflow-hidden">
          <div className="flex animate-infinite-slide shrink-0 flex-nowrap w-[700%]">
            {/* Repeat the images 4 times for continuous scrolling */}
            {[...Array(4)].map((_, fadeIndex) => (
              <div key={fadeIndex} className="flex whitespace-nowrap">
                {images.map((image, idx) => (
                  <div
                    key={idx}
                    className="h-28 w-28 sm:h-40 sm:w-40 flex flex-col justify-center items-center my-6 sm:my-0"
                  >
                    {/* Display each image with its name using Next/Image */}
                    <Image
                      src={image.src}
                      alt={image.name}
                      width={imageWidth * 0.75}
                      height={imageHeight * 0.75}
                      draggable={false} // Prevent dragging
                      className="mb-2 rounded-2xl object-contain" // Added object-contain
                      priority={idx < 10} // Prioritize loading initial images
                    />
                    <p className="text-sm">{image.name}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reverse Scrolling Animation Section */}
      <div className="relative mb-20">
        <div className="absolute top-0 left-0 h-full w-36 sm:w-56 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 h-full w-36 sm:w-56 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
        {/* Scrolling Container */}
        <div className="overflow-hidden">
          <div className="flex animate-infinite-slide-reverse shrink-0 flex-nowrap w-[700%]">
            {/* Repeat the reversed images 4 times for continuous reverse scrolling */}
            {[...Array(4)].map((_, fadeIndex) => (
              <div key={fadeIndex} className="flex whitespace-nowrap">
                {reversedImages.map((image, idx) => (
                  <div
                    key={`reverse-${idx}`}
                    className="h-28 w-28 sm:h-40 sm:w-40 flex flex-col justify-center items-center my-6 sm:my-0"
                  >
                    {/* Display each reversed image with its name using Next/Image */}
                    <Image
                      src={image.src}
                      alt={image.name}
                      width={imageWidth * 0.75}
                      height={imageHeight * 0.75}
                      draggable={false} // Prevent dragging
                      className="mb-2 rounded-2xl object-contain" // Added object-contain
                      priority={idx < 10} // Prioritize loading initial images
                    />
                    <p className="text-sm">{image.name}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
