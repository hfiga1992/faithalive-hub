import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export const useCostCenters = () => {
  const { church } = useAuth();
  const queryClient = useQueryClient();

  const { data: costCenters, isLoading } = useQuery({
    queryKey: ["cost-centers", church?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cost_centers")
        .select("*")
        .eq("church_id", church?.id)
        .order("name");

      if (error) throw error;
      return data;
    },
    enabled: !!church?.id,
  });

  const createCostCenter = useMutation({
    mutationFn: async (costCenter: {
      name: string;
      description?: string;
    }) => {
      const { data, error } = await supabase
        .from("cost_centers")
        .insert({
          ...costCenter,
          church_id: church?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cost-centers"] });
      toast.success("Centro de custo criado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao criar centro de custo: " + error.message);
    },
  });

  const updateCostCenter = useMutation({
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
        .from("cost_centers")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cost-centers"] });
      toast.success("Centro de custo atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar centro de custo: " + error.message);
    },
  });

  const deleteCostCenter = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("cost_centers")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cost-centers"] });
      toast.success("Centro de custo removido com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao remover centro de custo: " + error.message);
    },
  });

  return {
    costCenters,
    isLoading,
    createCostCenter,
    updateCostCenter,
    deleteCostCenter,
  };
};
