import { RoleSelector } from "@/components/auth/role-selector";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <RoleSelector />
      </div>
    </main>
  );
}
