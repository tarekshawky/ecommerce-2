import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";
import SignOutButton from "@/components/SignOutButton";
import { Menu } from "lucide-react";

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
      <input type="checkbox" id="admin-sidebar-toggle" className="peer hidden" />
      <Sidebar />
      <div className="flex-1 min-w-0">
        <header className="flex items-center justify-between gap-4 border-b border-gray-100 bg-white px-4 sm:px-8 py-4">
          <label
            htmlFor="admin-sidebar-toggle"
            className="md:hidden w-9 h-9 -ml-1 rounded-lg grid place-items-center hover:bg-gray-100 cursor-pointer text-gray-600"
          >
            <Menu size={20} />
          </label>
          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-800">{session.user.email}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
            <span className="w-9 h-9 rounded-full bg-accent/10 text-accent-dark grid place-items-center font-semibold text-sm shrink-0">
              {session.user.email?.[0]?.toUpperCase()}
            </span>
            <SignOutButton />
          </div>
        </header>
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
