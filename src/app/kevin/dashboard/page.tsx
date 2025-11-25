import { AppHeader } from "@/components/shared/app-header";
import { PostForm } from "@/components/kevin/post-form";

export default function KevinDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-headline mb-2">
                Kevin's Dashboard
            </h1>
            <p className="text-muted-foreground mb-8">
                Log your latest adventure. The world is watching.
            </p>
            <div className="max-w-2xl mx-auto">
                <PostForm />
            </div>
        </div>
      </main>
    </div>
  );
}
