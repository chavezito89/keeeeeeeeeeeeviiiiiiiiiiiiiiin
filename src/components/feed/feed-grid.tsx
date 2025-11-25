import type { KevinPost } from "@/lib/types";
import { PostCard } from "./post-card";
import { motion } from "framer-motion";

interface FeedGridProps {
  posts: KevinPost[];
}

export function FeedGrid({ posts }: FeedGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (posts.length === 0) {
    return <p className="text-center text-muted-foreground">No sightings of Kevin yet. Be the first to spot him!</p>;
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {posts.map((post) => (
        <motion.div key={post.id} variants={itemVariants}>
          <PostCard post={post} />
        </motion.div>
      ))}
    </motion.div>
  );
}
