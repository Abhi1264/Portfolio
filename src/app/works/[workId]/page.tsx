"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";

type Work = {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  tags: string[];
};

export default function WorkPage({ params }: { params: Promise<{ workId: string }> }) {
  const [work, setWork] = useState<Work | null>(null);
  const unwrappedParams = React.use(params);

  useEffect(() => {
    if (!unwrappedParams?.workId) return;

    const fetchWork = async () => {
      try {
        const workRef = doc(db, "works", unwrappedParams.workId);
        const workSnap = await getDoc(workRef);

        if (workSnap.exists()) {
          setWork({
            id: workSnap.id,
            ...workSnap.data(),
          } as Work);
        }
      } catch (error) {
        console.error("Error fetching work:", error);
      }
    };

    fetchWork();
  }, [unwrappedParams?.workId]);

  if (!work) {
    return (
      <main className="pt-24">
        <div className="container">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="w-8 h-8 border-t-2 border-purple-500 rounded-full animate-spin" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16 px-4 md:px-6">
      <article className="container mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{work.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <time dateTime={work.date}>
              {format(new Date(work.date), "MMMM d, yyyy")}
            </time>
            <Badge variant="outline" className="border-purple-500/50 text-purple-300">
              {work.category.charAt(0).toUpperCase() + work.category.slice(1)}
            </Badge>
          </div>
        </header>

        <div className="prose prose-invert prose-purple max-w-none">
          {work.content.split("\n").map((paragraph, idx) => (
            <p key={idx} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        <footer className="mt-8 pt-8 border-t border-purple-500/40">
          <div className="flex flex-wrap gap-2">
            {work.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="border-purple-500/50 text-purple-300"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </footer>
      </article>
    </main>
  );
}