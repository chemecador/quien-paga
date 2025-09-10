import { supabase } from "@/lib/db/supabase";

export interface ExpenseShare {
  userId: string;
  amount: number;
}

export interface Expense {
  id: string;
  group_id: string;
  description: string;
  amount: number;
  paid_by: string;
  created_at: string;
  shares: ExpenseShare[];
}

export async function createExpense({
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
  shares: ExpenseShare[];
}): Promise<{ success: boolean; error?: string }> {
  const { data: expense, error: expenseError } = await supabase
    .from("expenses")
    .insert([
      {
        group_id: groupId,
        description,
        amount,
        paid_by: paidBy,
      },
    ])
    .select()
    .single();

  if (expenseError || !expense) {
    return {
      success: false,
      error: expenseError?.message || "Error al crear gasto",
    };
  }

  const sharesToInsert = shares.map((share) => ({
    expense_id: expense.id,
    user_id: share.userId,
    amount: share.amount,
  }));

  const { error: sharesError } = await supabase
    .from("expense_shares")
    .insert(sharesToInsert);

  if (sharesError) {
    return { success: false, error: sharesError.message };
  }

  return { success: true };
}

export async function getGroupExpenses(groupId: string): Promise<Expense[]> {
  const { data: expenses, error } = await supabase
    .from("expenses")
    .select(
      `
      id,
      group_id,
      description,
      amount,
      paid_by,
      created_at,
      expense_shares (
        user_id,
        amount
      )
    `
    )
    .eq("group_id", groupId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching expenses:", error);
    return [];
  }

  return (expenses || []).map((expense) => ({
    ...expense,
    shares: (expense.expense_shares || []).map(
      (share: { user_id: string; amount: number }) => ({
        userId: share.user_id,
        amount: share.amount,
      })
    ),
  }));
}

export interface Transfer {
  id: string;
  group_id: string;
  from_user_id: string;
  to_user_id: string;
  amount: number;
  description: string;
  created_at: string;
  created_by: string;
}

export async function getGroupTransfers(groupId: string): Promise<Transfer[]> {
  const { data: transfers, error } = await supabase
    .from("transfers")
    .select("*")
    .eq("group_id", groupId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching transfers:", error);
    return [];
  }

  return transfers || [];
}
