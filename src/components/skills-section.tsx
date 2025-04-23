  export function SkillsSection() {
    const images = [
        { name: "AfterEffects", src: "/Technology-Logos/AfterEffects.svg" },
        { name: "AlpineJS", src: "/Technology-Logos/AlpineJS.svg" },
        { name: "AndroidStudio", src: "/Technology-Logos/AndroidStudio.svg" },
        { name: "Angular", src: "/Technology-Logos/Angular.svg" },
        { name: "AWS", src: "/Technology-Logos/AWS.svg" },
        { name: "Azure", src: "/Technology-Logos/Azure.svg" },
        { name: "Bash", src: "/Technology-Logos/Bash.svg" },
        { name: "Bootstrap", src: "/Technology-Logos/Bootstrap.svg" },
        { name: "BSD", src: "/Technology-Logos/BSD.svg" },
        { name: "C", src: "/Technology-Logos/C.svg" },
        { name: "C++", src: "/Technology-Logos/C++.svg" },
        { name: "C#", src: "/Technology-Logos/CSharp.svg" },
        { name: "CSS", src: "/Technology-Logos/CSS.svg" },
        { name: "Django", src: "/Technology-Logos/Django.svg" },
        { name: "Docker", src: "/Technology-Logos/Docker.svg" },
        { name: "DotNET", src: "/Technology-Logos/DotNET.svg" },
        { name: "DynamoDB", src: "/Technology-Logos/DynamoDB.svg" },
        { name: "Express", src: "/Technology-Logos/Express.svg" },
        { name: "Figma", src: "/Technology-Logos/Figma.svg" },
        { name: "Flutter", src: "/Technology-Logos/Flutter.svg" },
        { name: "Framer", src: "/Technology-Logos/Framer.svg" },
        { name: "Git", src: "/Technology-Logos/Git.svg" },
        { name: "GitHub", src: "/Technology-Logos/GitHub.svg" },
        { name: "GitLab", src: "/Technology-Logos/GitLab.svg" },
        { name: "HTML", src: "/Technology-Logos/HTML.svg" },
        { name: "Illustrator", src: "/Technology-Logos/Illustrator.svg" },
        { name: "Java", src: "/Technology-Logos/Java.svg" },
        { name: "JavaScript", src: "/Technology-Logos/JavaScript.svg" },
        { name: "JQuery", src: "/Technology-Logos/JQuery.svg" },
        { name: "Linux", src: "/Technology-Logos/Linux.svg" },
        { name: "MongoDB", src: "/Technology-Logos/MongoDB.svg" },
        { name: "MySQL", src: "/Technology-Logos/MySQL.svg" },
        { name: "NestJS", src: "/Technology-Logos/NestJS.svg" },
        { name: "Netlify", src: "/Technology-Logos/Netlify.svg" },
        { name: "NextJS", src: "/Technology-Logos/NextJS.svg" },
        { name: "NodeJS", src: "/Technology-Logos/NodeJS.svg" },
        { name: "NuxtJS", src: "/Technology-Logos/NuxtJS.svg" },
        { name: "Photoman", src: "/Technology-Logos/Photoman.svg" },
        { name: "Photoshop", src: "/Technology-Logos/Photoshop.svg" },
        { name: "PHP", src: "/Technology-Logos/PHP.svg" },
        { name: "Premiere", src: "/Technology-Logos/Premiere.svg" },
        { name: "Python", src: "/Technology-Logos/Python.svg" },
        { name: "PyTorch", src: "/Technology-Logos/PyTorch.svg" },
        { name: "R", src: "/Technology-Logos/R.svg" },
        { name: "ReactJS", src: "/Technology-Logos/React.svg" },
        { name: "Redux", src: "/Technology-Logos/Redux.svg" },
        { name: "Ruby", src: "/Technology-Logos/Ruby.svg" },
        { name: "SASS", src: "/Technology-Logos/SASS.svg" },
        { name: "SolidJS", src: "/Technology-Logos/SolidJS.svg" },
        { name: "Spring", src: "/Technology-Logos/Spring.svg" },
        { name: "SQLite", src: "/Technology-Logos/SQLite.svg" },
        { name: "StackOverFlow", src: "/Technology-Logos/StackOverFlow.svg" },
        { name: "Swift", src: "/Technology-Logos/Swift.svg" },
        { name: "TailwindCSS", src: "/Technology-Logos/TailwindCSS.svg" },
        { name: "Typescript", src: "/Technology-Logos/Typescript.svg" },
        { name: "VueJS", src: "/Technology-Logos/VueJS.svg" },
        { name: "Webflow", src: "/Technology-Logos/Webflow.svg" },
        { name: "WindiCSS", src: "/Technology-Logos/WindiCSS.svg" },
        { name: "WordPress", src: "/Technology-Logos/WordPress.svg" },
        { name: "XD", src: "/Technology-Logos/XD.svg" },
      ];
    
    // Reverse the images array for the reverse animation
    const reversedImages = [...images].reverse();
  
    return (
      <>  
        {/* Forward Scrolling Animation Section */}
        <div className="relative">          
          {/* Scrolling Container */}
          <div className="overflow-hidden">
            <div className="flex animate-infinite-slide shrink-0 flex-nowrap w-[750%]">
              {/* Repeat the images 4 times for continuous scrolling */}
              {[...Array(4)].map((_, fadeIndex) => (
                <div key={fadeIndex} className="flex whitespace-nowrap">
                  {images.map((image, idx) => (
                    <div
                      key={idx}
                      className="h-28 w-28 sm:h-40 sm:w-40 flex flex-col justify-center items-center my-6 sm:my-0"
                    >
                      {/* Display each image with its name */}
                      <img
                        src={image.src}
                        alt={image.name}
                        draggable={false}
                        className="mb-2 shadow-sm rounded-2xl"
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
          {/* Scrolling Container */}
          <div className="overflow-hidden">
            <div className="flex animate-infinite-slide-reverse shrink-0 flex-nowrap w-[750%]">
              {/* Repeat the reversed images 4 times for continuous reverse scrolling */}
              {[...Array(4)].map((_, fadeIndex) => (
                <div key={fadeIndex} className="flex whitespace-nowrap">
                  {reversedImages.map((image, idx) => (
                    <div
                      key={`reverse-${idx}`}
                      className="h-28 w-28 sm:h-40 sm:w-40 flex flex-col justify-center items-center my-6 sm:my-0"
                    >
                      {/* Display each reversed image with its name */}
                      <img
                        src={image.src}
                        alt={image.name}
                        draggable={false}
                        className="mb-2 shadow-sm rounded-2xl"
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
  };