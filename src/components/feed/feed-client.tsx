"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { KevinPost } from "@/lib/types";
import { KEVIN_USERNAME_KEY } from "@/lib/constants";
import { FeedGrid } from "./feed-grid";
import { motion } from "framer-motion";

interface FeedClientProps {
  posts: KevinPost[];
}

export function FeedClient({ posts }: FeedClientProps) {
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem(KEVIN_USERNAME_KEY);
    if (!storedUsername) {
      router.push("/");
    } else {
      setUsername(storedUsername);
    }
  }, [router]);

  if (!username) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold tracking-tight font-headline mb-8"
      >
        Welcome, <span className="text-primary">{username}</span>!
      </motion.h1>
      <FeedGrid posts={posts} />
    </div>
  );
}
