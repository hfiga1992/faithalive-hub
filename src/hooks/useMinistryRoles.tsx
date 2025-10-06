import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "./use-toast";

export interface MinistryRole {
  id: string;
  ministry_id: string;
  role_name: string;
  description: string | null;
  created_at: string;
}

export const useMinistryRoles = (ministryId?: string) => {
  const { user, hasAnyRole } = useAuth();
  const queryClient = useQueryClient();

  // Fetch roles for a ministry
  const { data: roles, isLoading, error } = useQuery({
    queryKey: ["ministryRoles", ministryId],
    queryFn: async () => {
      if (!ministryId) return [];

      const { data, error } = await supabase
        .from("ministry_roles")
        .select("*")
        .eq("ministry_id", ministryId)
        .order("role_name");

      if (error) throw error;
      return data as MinistryRole[];
    },
    enabled: !!ministryId && !!user,
  });

  // Create role
  const createRole = useMutation({
    mutationFn: async (roleData: Omit<MinistryRole, 'id' | 'created_at'>) => {
      if (!hasAnyRole(['PASTOR', 'LEADER'])) {
        throw new Error("Você não tem permissão para criar funções");
      }

      const { data, error } = await supabase
        .from("ministry_roles")
        .insert(roleData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministryRoles"] });
      toast({
        title: "Função criada!",
        description: "A nova função foi adicionada ao ministério.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar função",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete role
  const deleteRole = useMutation({
    mutationFn: async (roleId: string) => {
      if (!hasAnyRole(['PASTOR', 'LEADER'])) {
        throw new Error("Você não tem permissão para excluir funções");
      }

      const { error } = await supabase
        .from("ministry_roles")
        .delete()
        .eq("id", roleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministryRoles"] });
      toast({
        title: "Função excluída",
        description: "A função foi removida do ministério.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    roles: roles || [],
    isLoading,
    error,
    createRole: createRole.mutate,
    deleteRole: deleteRole.mutate,
    isCreating: createRole.isPending,
    isDeleting: deleteRole.isPending,
  };
};
