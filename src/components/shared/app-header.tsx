import Link from "next/link";
import { Camera } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between p-4 sm:p-6 lg:p-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Camera className="h-6 w-6 text-primary" />
          <span>{APP_NAME}</span>
        </Link>
        <div className="flex items-center gap-2">
            <Button asChild>
                <Link href="/feed">Feed</Link>
            </Button>
            <Button variant="outline" asChild>
                <Link href="/kevin/dashboard">Kevin's Panel</Link>
            </Button>
        </div>
      </div>
    </header>
  );
}
