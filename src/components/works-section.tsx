"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
import { MdArrowForward } from "react-icons/md";
import Link from "next/link";

type Work = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  date: string;
  tags: string[];
};

export function WorksSection() {
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Use useCallback to memoize the fetch function
  const fetchWorks = useCallback(async () => {
    try {
      setIsLoading(true);
      const worksQuery = query(
        collection(db, "works"),
        orderBy("date", "desc"),
        limit(4)
      );
      const worksSnapshot = await getDocs(worksQuery);
      const worksData = worksSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Work[];
      setWorks(worksData);
    } catch (error) {
      console.error("Error fetching works:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  // Memoize the work cards to prevent unnecessary re-renders
  const workCards = useMemo(() => {
    if (isLoading) {
      return Array(4).fill(0).map((_, index) => (
        <Card key={`loading-${index}`} className="bg-black/50 border border-purple-500/40 overflow-hidden animate-pulse">
          <CardContent className="p-6 h-48"></CardContent>
        </Card>
      ));
    }

    return works.map((work) => (
      <Link href={`/works/${work.id}`} key={work.id}>
        <Card className="bg-black/50 border border-purple-500/40 overflow-hidden hover:border-purple-500/40 hover:transform hover:scale-[1.02] transition-all duration-200 cursor-pointer">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold line-clamp-2">
                {work.title}
              </h3>
              <Badge
                variant="outline"
                className="border-purple-500/50 text-purple-300 capitalize"
              >
                {work.category}
              </Badge>
            </div>
            <p className="text-muted-foreground mb-4 line-clamp-3">
              {work.excerpt}
            </p>
            <div className="flex justify-between items-center">
              <time
                dateTime={work.date}
                className="text-sm text-muted-foreground"
              >
                {format(new Date(work.date), "MMMM d, yyyy")}
              </time>
              <div className="flex flex-wrap gap-2">
                {work.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 capitalize"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    ));
  }, [works, isLoading]);

  return (
    <section id="works" className="py-20 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-pink-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Literary Works
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full mb-8" />
          <p className="max-w-5xl text-muted-foreground">
            A collection of my literary works. Each piece reflects my thoughts, experiences, and creativity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {workCards}
        </div>

        <div className="flex justify-center mt-12">
          <Link href="/works" passHref>
            <Button
              asChild
              variant="outline"
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 text-lg px-6 py-5 cursor-pointer"
            >
              <span>
                View All Works <MdArrowForward className="ml-2" />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
