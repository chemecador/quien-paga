import { currentUser } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getGroupById, isUserMemberOfGroup } from "@/lib/services/groupService";

export const dynamic = "force-dynamic";

export default async function GroupDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const resolvedParams = await params;
  const groupId = resolvedParams.id;

  const isMember = await isUserMemberOfGroup(user.id, groupId);
  if (!isMember) {
    return notFound();
  }

  const group = await getGroupById(groupId);
  if (!group) {
    return notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6 flex items-center text-sm text-gray-500">
        <Link href="/dashboard" className="hover:text-gray-700">
          Dashboard
        </Link>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-3 h-3 mx-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
        <span className="font-medium text-gray-900">{group.name}</span>
      </div>
      {children}
    </div>
  );
}
