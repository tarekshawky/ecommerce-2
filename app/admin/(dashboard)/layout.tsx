import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";
import SignOutButton from "@/components/SignOutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Middleware already guards this route group; this is a defensive
  // fallback in case the session expired between middleware and render.
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <header className="flex items-center justify-end gap-4 border-b border-gray-100 bg-white px-8 py-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">{session.user.email}</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
          <span className="w-9 h-9 rounded-full bg-accent/10 text-accent-dark grid place-items-center font-semibold text-sm">
            {session.user.email?.[0]?.toUpperCase()}
          </span>
          <SignOutButton />
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
