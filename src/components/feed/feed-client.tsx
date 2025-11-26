
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { KevinPost } from "@/lib/types";
import { KEVIN_USERNAME_KEY } from "@/lib/constants";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { FeedTabs } from "./feed-tabs";

interface FeedClientProps {
  posts: KevinPost[];
}

export function FeedClient({ posts }: FeedClientProps) {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem(KEVIN_USERNAME_KEY);
    if (!storedUsername) {
      router.push("/");
    } else {
      setUsername(storedUsername);
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Cargando feed...</p>
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
        ¡Bienvenido, <span className="text-primary">{username}</span>!
      </motion.h1>
      <FeedTabs posts={posts} />
    </div>
  );
}
