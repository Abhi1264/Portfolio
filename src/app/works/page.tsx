"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
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

export default function WorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const worksQuery = query(
          collection(db, "works"),
          orderBy("date", "desc")
        );
        const worksSnapshot = await getDocs(worksQuery);
        const worksData = worksSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Work[];
        setWorks(worksData);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(worksData.map((work) => work.category))
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching works:", error);
      }
    };

    fetchWorks();
  }, []);

  const filteredWorks =
    selectedCategory === "all"
      ? works
      : works.filter((work) => work.category === selectedCategory);

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4">
            My Works
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full mb-8" />
          <p className="max-w-3xl text-muted-foreground text-lg">
            A collection of my writings, including poems, essays, and creative
            works. Explore different categories to find what interests you.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            className={
              selectedCategory === "all"
                ? "bg-purple-600 hover:bg-purple-700 cursor-pointer capitalize"
                : "border-purple-500/50 text-purple-300 hover:bg-purple-500/10 cursor-pointer capitalize"
            }
          >
            all categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "bg-purple-600 hover:bg-purple-700 cursor-pointer capitalize"
                  : "border-purple-500/50 text-purple-300 hover:bg-purple-500/10 cursor-pointer capitalize"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Works Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorks.map((work) => (
            <Link href={`/works/${work.id}`} key={work.id}>
              <Card className="h-full bg-black/50 border border-purple-500/40 hover:border-purple-500/60 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <h2 className="text-xl font-bold line-clamp-2 flex-1">
                        {work.title}
                      </h2>
                      <Badge
                        variant="outline"
                        className="border-purple-500/50 text-purple-300 shrink-0"
                      >
                        {work.category}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
                      {work.excerpt}
                    </p>
                    <div className="mt-auto">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <div className="flex flex-wrap gap-4">
                          {work.tags.map((tag) => (
                            <span
                              key={tag}
                              className="capitalize bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <time
                        dateTime={work.date}
                        className="text-sm text-purple-400"
                      >
                        {format(new Date(work.date), "MMMM d, yyyy")}
                      </time>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
