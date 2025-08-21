import { currentUser } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getGroupById, getGroupMembers } from "@/lib/services/groupService";
import ClientGroupDetailPage from "./ClientGroupDetailPage";

export const dynamic = "force-dynamic";

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const resolvedParams = await params;
  const groupId = resolvedParams.id;

  const group = await getGroupById(groupId);
  const members = await getGroupMembers(groupId);

  if (!group) {
    return notFound();
  }

  return (
    <ClientGroupDetailPage
      group={group}
      members={members}
      groupId={groupId}
      currentUserId={user.id}
    />
  );
}
