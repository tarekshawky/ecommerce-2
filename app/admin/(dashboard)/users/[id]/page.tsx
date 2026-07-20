import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import UserForm from "@/components/admin/UserForm";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [session, user] = await Promise.all([
    getServerSession(authOptions),
    prisma.user.findUnique({ where: { id } }),
  ]);

  if (!user) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit User</h1>
      <UserForm user={user} isSelf={user.id === session?.user.id} />
    </div>
  );
}
