"use server";

import { currentUser } from "@clerk/nextjs/server";
import { supabase } from "@/lib/db/supabase";
import { v4 as uuidv4 } from "uuid";

export async function addMemberToGroupAction({
  groupId,
  displayName,
  email,
}: {
  groupId: string;
  displayName: string;
  email: string;
}) {
  const user = await currentUser();
  if (!user) throw new Error("Usuario no autenticado");

  // Verificar que el usuario actual es admin del grupo
  const { data: currentMember } = await supabase
    .from("members")
    .select("role")
    .eq("group_id", groupId)
    .eq("user_id", user.id)
    .single();

  if (!currentMember || currentMember.role !== "admin") {
    throw new Error("No tienes permisos para añadir miembros a este grupo");
  }

  // Crear el nuevo miembro
  const { data: newMember, error } = await supabase
    .from("members")
    .insert([
      {
        id: uuidv4(),
        group_id: groupId,
        user_id: "", // Para MVP, los miembros no tienen user_id real
        display_name: displayName,
        email: email, // Ahora siempre es string (puede estar vacío)
        role: "member",
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error("Error al añadir miembro: " + error.message);
  }

  return { success: true, member: newMember };
}
