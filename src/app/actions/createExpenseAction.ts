"use server";

import { currentUser } from "@clerk/nextjs/server";
import { createExpense } from "@/lib/services/expenseService";

export async function createExpenseAction({
  groupId,
  description,
  amount,
  paidBy,
  shares,
}: {
  groupId: string;
  description: string;
  amount: number;
  paidBy: string;
  shares: { userId: string; amount: number }[];
}) {
  const user = await currentUser();
  if (!user) throw new Error("Usuario no autenticado");

  const result = await createExpense({
    groupId,
    description,
    amount,
    paidBy,
    shares,
  });

  if (!result.success) {
    throw new Error(result.error || "Error al crear gasto");
  }

  return { success: true };
}
