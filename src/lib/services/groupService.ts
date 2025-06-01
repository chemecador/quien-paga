import { supabase } from "@/lib/db/supabase";
import { Group, Member } from "@/lib/types";

export async function createGroup(
  groupData: Omit<Group, "id" | "created_at" | "updated_at">,
  creatorMember: Omit<Member, "id" | "group_id">
): Promise<Group | null> {
  try {
    console.log("Iniciando creación de grupo con datos:", groupData);
    console.log(
      "Configuración Supabase URL:",
      process.env.NEXT_PUBLIC_SUPABASE_URL
    );

    const { error: connectionError } = await supabase
      .from("groups")
      .select("*")
      .limit(1);

    if (connectionError) {
      console.error("Error de conexión con Supabase:", connectionError);
      throw new Error(`Error de conexión: ${connectionError.message}`);
    }

    console.log("Conexión con Supabase exitosa");

    console.log("Insertando grupo...");
    const { data: group, error: groupError } = await supabase
      .from("groups")
      .insert([groupData])
      .select()
      .single();

    if (groupError) {
      console.error("Error al insertar grupo:", groupError);
      console.error("Detalles del error:", {
        message: groupError.message,
        code: groupError.code,
        hint: groupError.hint,
        details: groupError.details,
      });
      throw new Error(`Error al crear grupo: ${groupError.message}`);
    }

    if (!group) {
      console.error("No se recibió datos del grupo creado");
      throw new Error("No se pudo crear el grupo - no se recibieron datos");
    }

    console.log("Grupo creado exitosamente:", group);

    console.log("Insertando creador como miembro...");
    const memberData = {
      ...creatorMember,
      group_id: group.id,
      role: "admin" as const,
    };

    console.log("Datos del miembro a insertar:", memberData);

    const { error: memberError } = await supabase
      .from("members")
      .insert([memberData]);

    if (memberError) {
      console.error("Error al insertar miembro:", memberError);
      console.error("Detalles del error de miembro:", {
        message: memberError.message,
        code: memberError.code,
        hint: memberError.hint,
        details: memberError.details,
      });

      console.log("Intentando eliminar grupo debido a error en miembro...");
      const { error: deleteError } = await supabase
        .from("groups")
        .delete()
        .eq("id", group.id);

      if (deleteError) {
        console.error("Error al eliminar grupo:", deleteError);
      }

      throw new Error(`Error al añadir miembro: ${memberError.message}`);
    }

    console.log("Miembro creado exitosamente");
    console.log("Grupo completo creado:", group);
    return group;
  } catch (error) {
    console.error("Error general en createGroup:", error);
    if (error instanceof Error) {
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);
    }
    throw error;
  }
}

export async function getUserGroups(userId: string): Promise<Group[]> {
  try {
    const { data, error } = await supabase
      .from("groups")
      .select(
        `
        *,
        members!inner(*)
      `
      )
      .eq("members.user_id", userId);

    if (error) {
      console.error("Error al obtener los grupos del usuario:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error en getUserGroups:", error);
    return [];
  }
}

export async function getGroupById(groupId: string): Promise<Group | null> {
  try {
    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .eq("id", groupId)
      .single();

    if (error) {
      console.error("Error al obtener el grupo:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error en getGroupById:", error);
    return null;
  }
}

export async function getGroupMembers(groupId: string): Promise<Member[]> {
  try {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("group_id", groupId);

    if (error) {
      console.error("Error al obtener los miembros del grupo:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error en getGroupMembers:", error);
    return [];
  }
}

export async function addGroupMember(
  memberData: Omit<Member, "id">
): Promise<boolean> {
  try {
    const { error } = await supabase.from("members").insert([memberData]);

    if (error) {
      console.error("Error al añadir el miembro:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error en addGroupMember:", error);
    return false;
  }
}

export async function addGroupMembers(
  groupId: string,
  members: Omit<Member, "id" | "group_id">[]
): Promise<boolean> {
  if (members.length === 0) return true;

  try {
    const membersToAdd = members.map((member) => ({
      ...member,
      group_id: groupId,
    }));

    const { error } = await supabase.from("members").insert(membersToAdd);

    if (error) {
      console.error("Error al añadir los miembros:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error en addGroupMembers:", error);
    return false;
  }
}

export async function isUserMemberOfGroup(
  userId: string,
  groupId: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("members")
      .select("id")
      .eq("group_id", groupId)
      .eq("user_id", userId)
      .single();

    if (error) {
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("Error en isUserMemberOfGroup:", error);
    return false;
  }
}

export async function deleteGroup(
  groupId: string,
  userId: string
): Promise<void> {
  try {
    const { data: member, error: memberError } = await supabase
      .from("members")
      .select("role")
      .eq("group_id", groupId)
      .eq("user_id", userId)
      .eq("role", "admin")
      .single();

    if (memberError || !member) {
      throw new Error("No tienes permisos para eliminar este grupo");
    }

    const { error: expensesError } = await supabase
      .from("expenses")
      .delete()
      .eq("group_id", groupId);

    if (expensesError) {
      console.error("Error al eliminar gastos:", expensesError);
    }

    const { error: membersError } = await supabase
      .from("members")
      .delete()
      .eq("group_id", groupId);

    if (membersError) {
      console.error("Error al eliminar miembros:", membersError);
      throw new Error(`Error al eliminar miembros: ${membersError.message}`);
    }

    const { error: groupError } = await supabase
      .from("groups")
      .delete()
      .eq("id", groupId);

    if (groupError) {
      console.error("Error al eliminar grupo:", groupError);
      throw new Error(`Error al eliminar grupo: ${groupError.message}`);
    }

    console.log("Grupo eliminado exitosamente:", groupId);
  } catch (error) {
    console.error("Error en deleteGroup:", error);
    throw error;
  }
}
