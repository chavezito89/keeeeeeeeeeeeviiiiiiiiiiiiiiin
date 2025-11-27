import { AppHeader } from "@/components/shared/app-header";
import { PostForm } from "@/components/kevin/post-form";

export default function KevinDashboardPage() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader showNavButtons={true} />
      <main className="flex-1">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-headline mb-2">
                Panel de Kevin
            </h1>
            <p className="text-muted-foreground mb-8">
                Registra tu última aventura. El mundo te observa.
            </p>
            <div className="max-w-2xl mx-auto">
                <PostForm mapboxToken={mapboxToken} />
            </div>
        </div>
      </main>
    </div>
  );
}
