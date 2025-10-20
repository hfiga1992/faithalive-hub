import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

type TransactionType = "INCOME" | "EXPENSE";
type TransactionStatus = "PAID" | "PENDING" | "OVERDUE" | "CANCELLED";
type PaymentType = "UNICO" | "PARCELADO" | "RECORRENTE";

export const useFinancialTransactions = () => {
  const { church, profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["financial-transactions", church?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_transactions")
        .select(`
          *,
          account:financial_accounts(name),
          category:financial_categories(name, color),
          contact:financial_contacts(name),
          cost_center:cost_centers(name)
        `)
        .eq("church_id", church?.id)
        .order("transaction_date", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!church?.id,
  });

  const createTransaction = useMutation({
    mutationFn: async (transaction: {
      type: TransactionType;
      description: string;
      amount: number;
      transaction_date: string;
      due_date?: string;
      competency_date?: string;
      status?: TransactionStatus;
      payment_type?: PaymentType;
      document_number?: string;
      notes?: string;
      account_id?: string;
      category_id?: string;
      contact_id?: string;
      cost_center_id?: string;
    }) => {
      const { data, error } = await supabase
        .from("financial_transactions")
        .insert({
          ...transaction,
          church_id: church?.id,
          created_by: profile?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-transactions"] });
      toast.success("Transação criada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao criar transação: " + error.message);
    },
  });

  const updateTransaction = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from("financial_transactions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-transactions"] });
      toast.success("Transação atualizada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar transação: " + error.message);
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("financial_transactions")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-transactions"] });
      toast.success("Transação removida com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao remover transação: " + error.message);
    },
  });

  return {
    transactions,
    isLoading,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
};
