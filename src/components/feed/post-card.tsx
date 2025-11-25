import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock } from "lucide-react";
import type { KevinPost } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PostCardProps {
  post: KevinPost;
}

export function PostCard({ post }: PostCardProps) {
  const { imageUrl, imageHint, comment, latitude, longitude, createdAt } = post;
  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  return (
    <Card className="overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0 relative aspect-w-4 aspect-h-3">
        <Image
          src={imageUrl}
          alt={comment || "A sighting of Kevin"}
          width={600}
          height={450}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={imageHint}
        />
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <p className="text-foreground">{comment}</p>
      </CardContent>
      <CardFooter className="p-6 bg-secondary/50 flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link href={gmapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group/link">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground group-hover/link:text-primary transition-colors">
            View Location
          </span>
        </Link>
        <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{createdAt}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
