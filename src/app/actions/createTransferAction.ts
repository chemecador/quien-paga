"use server";

import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/db/supabase";
import { redirect } from "next/navigation";

interface CreateTransferParams {
  groupId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  description?: string;
}

export async function createTransferAction({
  groupId,
  fromUserId,
  toUserId,
  amount,
  description = "Transferencia",
}: CreateTransferParams) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  try {
    const { data: currentMember } = await supabase
      .from("members")
      .select("*")
      .eq("group_id", groupId)
      .eq("user_id", userId)
      .single();

    if (!currentMember) {
      throw new Error("No eres miembro de este grupo");
    }

    const { data: members } = await supabase
      .from("members")
      .select("*")
      .eq("group_id", groupId)
      .in("id", [fromUserId, toUserId]);

    if (!members || members.length !== 2) {
      throw new Error("Los usuarios seleccionados no son válidos");
    }

    console.log("Creating transfer with data:", {
      group_id: groupId,
      from_user_id: fromUserId,
      to_user_id: toUserId,
      amount: amount,
      description: description,
      created_by: userId,
    });

    const { data: transfer, error } = await supabase
      .from("transfers")
      .insert({
        group_id: groupId,
        from_user_id: fromUserId,
        to_user_id: toUserId,
        amount: amount,
        description: description,
        created_by: userId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating transfer:", error);
      console.error("Full error details:", JSON.stringify(error, null, 2));
      throw new Error("Error al crear la transferencia");
    }

    return { success: true, transfer };
  } catch (error) {
    console.error("Error in createTransferAction:", error);
    throw error;
  }
}
