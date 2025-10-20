import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export const useFinancialAccounts = () => {
  const { church } = useAuth();
  const queryClient = useQueryClient();

  const { data: accounts, isLoading } = useQuery({
    queryKey: ["financial-accounts", church?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_accounts")
        .select("*")
        .eq("church_id", church?.id)
        .order("name");

      if (error) throw error;
      return data;
    },
    enabled: !!church?.id,
  });

  const createAccount = useMutation({
    mutationFn: async (account: {
      name: string;
      description?: string;
      initial_balance?: number;
    }) => {
      const { data, error } = await supabase
        .from("financial_accounts")
        .insert({
          ...account,
          church_id: church?.id,
          current_balance: account.initial_balance || 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-accounts"] });
      toast.success("Conta criada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao criar conta: " + error.message);
    },
  });

  const updateAccount = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: {
      id: string;
      name?: string;
      description?: string;
      is_active?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("financial_accounts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-accounts"] });
      toast.success("Conta atualizada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar conta: " + error.message);
    },
  });

  const deleteAccount = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("financial_accounts")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-accounts"] });
      toast.success("Conta removida com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao remover conta: " + error.message);
    },
  });

  return {
    accounts,
    isLoading,
    createAccount,
    updateAccount,
    deleteAccount,
  };
};
