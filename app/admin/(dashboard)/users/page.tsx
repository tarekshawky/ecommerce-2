import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import DeleteUserButton from "@/components/admin/DeleteUserButton";

export const runtime = "nodejs";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-sm text-gray-500 mt-1">{users.length} total</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
              <th className="py-3 px-5">Name</th>
              <th className="py-3 px-5">Email</th>
              <th className="py-3 px-5">Role</th>
              <th className="py-3 px-5">Orders</th>
              <th className="py-3 px-5">Joined</th>
              <th className="py-3 px-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/60">
                <td className="py-3 px-5 font-medium text-gray-800">
                  {u.name || "—"}
                  {u.id === session?.user.id && (
                    <span className="ml-2 text-xs font-semibold text-accent-dark bg-accent/10 px-2 py-0.5 rounded-full">
                      You
                    </span>
                  )}
                </td>
                <td className="py-3 px-5 text-gray-600">{u.email}</td>
                <td className="py-3 px-5">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      u.role === "ADMIN" ? "bg-accent/10 text-accent-dark" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-5 text-gray-600">{u._count.orders}</td>
                <td className="py-3 px-5 text-gray-500 text-sm">{u.createdAt.toLocaleDateString()}</td>
                <td className="py-3 px-5">
                  <div className="flex items-center gap-4">
                    <Link href={`/admin/users/${u.id}`} className="text-accent-dark hover:underline text-sm font-medium">
                      Edit
                    </Link>
                    {u.id !== session?.user.id && <DeleteUserButton id={u.id} name={u.name || u.email} />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && <p className="text-gray-500 text-sm p-8 text-center">No users yet.</p>}
      </div>
    </div>
  );
}
