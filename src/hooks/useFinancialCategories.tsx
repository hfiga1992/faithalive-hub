import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

type TransactionType = "INCOME" | "EXPENSE";

export const useFinancialCategories = () => {
  const { church } = useAuth();
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ["financial-categories", church?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_categories")
        .select("*")
        .eq("church_id", church?.id)
        .order("name");

      if (error) throw error;
      return data;
    },
    enabled: !!church?.id,
  });

  const incomeCategories = categories?.filter((c) => c.type === "INCOME") || [];
  const expenseCategories = categories?.filter((c) => c.type === "EXPENSE") || [];

  const createCategory = useMutation({
    mutationFn: async (category: {
      name: string;
      description?: string;
      type: TransactionType;
      color?: string;
    }) => {
      const { data, error } = await supabase
        .from("financial_categories")
        .insert({
          ...category,
          church_id: church?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-categories"] });
      toast.success("Categoria criada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao criar categoria: " + error.message);
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: {
      id: string;
      name?: string;
      description?: string;
      color?: string;
      is_active?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("financial_categories")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-categories"] });
      toast.success("Categoria atualizada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar categoria: " + error.message);
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("financial_categories")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-categories"] });
      toast.success("Categoria removida com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao remover categoria: " + error.message);
    },
  });

  return {
    categories,
    incomeCategories,
    expenseCategories,
    isLoading,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
