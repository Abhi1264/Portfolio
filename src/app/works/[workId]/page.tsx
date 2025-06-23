"use client";
export const dynamic = "force-dynamic";
import React, { useEffect, useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
import { WorkInteractions } from "@/components/ui/work-interactions";
import Link from "next/link";

type Work = {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  tags: string[];
  likes?: string[];
  comments?: Array<{
    id: string;
    text: string;
    userId: string;
    userImage: string;
    userName: string;
    createdAt: string;
  }>;
};

export default function WorkPage({
  params,
}: {
  params: Promise<{ workId: string }>;
}) {
  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const unwrappedParams = React.use(params);

  useEffect(() => {
    async function fetchWork() {
      if (!unwrappedParams?.workId) {
        setError("Work ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const workRef = doc(db, "works", unwrappedParams.workId);
        const workSnap = await getDoc(workRef);

        if (workSnap.exists()) {
          setWork({
            id: workSnap.id,
            ...workSnap.data(),
          } as Work);
        } else {
          setError("Work not found");
        }
      } catch (error) {
        console.error("Error fetching work:", error);
        setError("Failed to load the work. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchWork();
  }, [unwrappedParams?.workId]);

  // Memoize the content paragraphs to avoid re-rendering
  const contentParagraphs = useMemo(() => {
    if (!work?.content) return [];
    return work.content.split("\n").map((paragraph, idx) => (
      <p key={idx} className="mb-4">
        {paragraph}
      </p>
    ));
  }, [work?.content]);

  // Memoize the tags to avoid re-rendering
  const tagBadges = useMemo(() => {
    if (!work?.tags) return [];
    return work.tags.map((tag) => (
      <Badge
        key={tag}
        variant="outline"
        className="border-purple-500/50 text-purple-300 capitalize"
      >
        {tag}
      </Badge>
    ));
  }, [work?.tags]);

  if (loading) {
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

  if (error) {
    return (
      <main className="pt-24">
        <div className="container">
          <div className="flex flex-col justify-center items-center min-h-[60vh] text-center">
            <h1 className="text-3xl font-bold text-red-500 mb-4">Error</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Link
              href="/works"
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Return to Works
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!work) {
    return null;
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
            <Badge
              variant="outline"
              className="border-purple-500/50 text-purple-300"
            >
              {work.category.charAt(0).toUpperCase() + work.category.slice(1)}
            </Badge>
          </div>
        </header>

        <div className="prose prose-invert prose-purple max-w-none">
          {contentParagraphs}
        </div>

        <footer className="mt-8 pt-8 border-t border-purple-500/40">
          <div className="flex flex-wrap gap-2 mb-8">
            {tagBadges}
          </div>

          <WorkInteractions workId={work.id} />
        </footer>
      </article>
    </main>
  );
}
