import Image from "next/image";

interface AvatarProps {
  src?: string | null;
  alt: string;
}

export function Avatar({ src, alt }: AvatarProps) {
  return (
    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-purple-500/20">
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-purple-300">
          {alt[0]?.toUpperCase()}
        </div>
      )}
    </div>
  );
}
