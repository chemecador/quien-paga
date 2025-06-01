"use server";

import { currentUser } from "@clerk/nextjs/server";
import { deleteGroup } from "@/lib/services/groupService";

export async function deleteGroupAction(groupId: string) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Usuario no autenticado");
  }

  try {
    await deleteGroup(groupId, user.id);

    return { success: true };
  } catch (error) {
    console.error("Error eliminando grupo:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error eliminando el grupo"
    );
  }
}
