import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logQueryError } from "@/lib/queryConfig";
import { toast } from "./use-toast";

export interface MinistryMember {
  id: string;
  ministry_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

export const useMinistryMembers = (ministryId?: string) => {
  const query = useQuery({
    queryKey: ["ministry-members", ministryId],
    queryFn: async () => {
      if (!ministryId) return [];
      
      try {
        const { data, error } = await supabase
          .from("ministry_members")
          .select(`
            *,
            profiles:user_id (
              id,
              name,
              photo_url
            )
          `)
          .eq("ministry_id", ministryId)
          .order("joined_at", { ascending: false });

        if (error) throw error;
        return data as (MinistryMember & { profiles: any })[];
      } catch (error: any) {
        logQueryError('useMinistryMembers', error);
        throw error;
      }
    },
    enabled: !!ministryId,
  });

  return {
    ...query,
    members: query.data || [],
  };
};

export const useAddMinistryMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (member: { ministry_id: string; user_id: string; role?: string }) => {
      try {
        const { data, error } = await supabase
          .from("ministry_members")
          .insert({
            ministry_id: member.ministry_id,
            user_id: member.user_id,
            role: member.role || 'MEMBER',
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error: any) {
        logQueryError('useAddMinistryMember', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ministry-members", variables.ministry_id] });
      toast({
        title: "Membro adicionado!",
        description: "O membro foi adicionado ao ministério com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao adicionar membro",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateMinistryMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ministry_id, ...updates }: Partial<MinistryMember> & { id: string; ministry_id: string }) => {
      try {
        const { data, error } = await supabase
          .from("ministry_members")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error: any) {
        logQueryError('useUpdateMinistryMember', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ministry-members", variables.ministry_id] });
      toast({
        title: "Membro atualizado!",
        description: "As informações do membro foram atualizadas.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar membro",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useRemoveMinistryMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ministry_id }: { id: string; ministry_id: string }) => {
      try {
        const { error } = await supabase
          .from("ministry_members")
          .delete()
          .eq("id", id);

        if (error) throw error;
      } catch (error: any) {
        logQueryError('useRemoveMinistryMember', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ministry-members", variables.ministry_id] });
      toast({
        title: "Membro removido!",
        description: "O membro foi removido do ministério.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover membro",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
