import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "./use-toast";

export interface Member {
  id: string;
  church_id: string | null;
  name: string;
  phone: string | null;
  photo_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  email?: string;
  roles?: string[];
}

interface MemberFilters {
  search?: string;
  role?: string;
  ministry?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export const useMembers = () => {
  const { user, hasRole, hasAnyRole } = useAuth();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<MemberFilters>({
    page: 1,
    pageSize: 10,
  });

  // Fetch members with filters and pagination
  const { data, isLoading, error } = useQuery({
    queryKey: ["members", filters],
    queryFn: async () => {
      // First get profiles
      let profileQuery = supabase
        .from("profiles")
        .select('*', { count: 'exact' });

      // Apply search filter
      if (filters.search) {
        profileQuery = profileQuery.or(`name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
      }

      // Apply status filter
      if (filters.status && filters.status !== 'all') {
        profileQuery = profileQuery.eq('status', filters.status.toUpperCase());
      }

      // Apply pagination
      const from = ((filters.page || 1) - 1) * (filters.pageSize || 10);
      const to = from + (filters.pageSize || 10) - 1;
      profileQuery = profileQuery.range(from, to);

      const { data: profiles, error: profileError, count } = await profileQuery;

      if (profileError) throw profileError;

      // Get roles for all profiles
      const profileIds = profiles?.map(p => p.id) || [];
      const { data: roles } = await supabase
        .from("user_roles")
        .select('user_id, role')
        .in('user_id', profileIds);

      // Map roles to profiles
      const members = (profiles || []).map(profile => ({
        ...profile,
        roles: roles?.filter(r => r.user_id === profile.id).map(r => r.role) || []
      }));

      return {
        members: members as Member[],
        total: count || 0,
        page: filters.page || 1,
        pageSize: filters.pageSize || 10,
        totalPages: Math.ceil((count || 0) / (filters.pageSize || 10)),
      };
    },
    enabled: !!user,
  });

  // Create member
  const createMember = useMutation({
    mutationFn: async (memberData: {
      email: string;
      password: string;
      name: string;
      phone?: string;
      church_id: string;
      role: string;
      photo_url?: string;
    }) => {
      // Only PASTOR and LEADER can create members
      if (!hasAnyRole(['PASTOR', 'LEADER'])) {
        throw new Error("Você não tem permissão para criar membros");
      }

      // Call edge function to create member without auto-login
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error("Sessão inválida");
      }

      const response = await supabase.functions.invoke('create-member', {
        body: memberData,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "Erro ao criar membro");
      }

      if (!response.data.success) {
        throw new Error(response.data.error || "Erro ao criar membro");
      }

      return response.data.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast({
        title: "Membro criado com sucesso!",
        description: "O novo membro foi adicionado à igreja.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar membro",
        description: error.message || "Ocorreu um erro ao criar o membro.",
        variant: "destructive",
      });
    },
  });

  // Update member
  const updateMember = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Member> & { id: string }) => {
      // Only PASTOR and LEADER can update members
      if (!hasAnyRole(['PASTOR', 'LEADER'])) {
        throw new Error("Você não tem permissão para atualizar membros");
      }

      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast({
        title: "Membro atualizado!",
        description: "As informações foram atualizadas com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Ocorreu um erro ao atualizar o membro.",
        variant: "destructive",
      });
    },
  });

  // Soft delete member (set status to INACTIVE)
  const deleteMember = useMutation({
    mutationFn: async (memberId: string) => {
      // Only PASTOR can delete members
      if (!hasRole('PASTOR')) {
        throw new Error("Apenas o Pastor pode remover membros");
      }

      const { data, error } = await supabase
        .from("profiles")
        .update({ status: 'INACTIVE' })
        .eq("id", memberId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast({
        title: "Membro removido",
        description: "O membro foi marcado como inativo.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover",
        description: error.message || "Ocorreu um erro ao remover o membro.",
        variant: "destructive",
      });
    },
  });

  // Upload photo
  const uploadPhoto = async (file: File, userId: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Use signed URL with 1 hour expiry for better security
    const { data, error: urlError } = await supabase.storage
      .from('avatars')
      .createSignedUrl(filePath, 3600);

    if (urlError) throw urlError;

    return data.signedUrl;
  };

  return {
    members: data?.members || [],
    total: data?.total || 0,
    page: data?.page || 1,
    pageSize: data?.pageSize || 10,
    totalPages: data?.totalPages || 0,
    isLoading,
    error,
    filters,
    setFilters,
    createMember: createMember.mutate,
    updateMember: updateMember.mutate,
    deleteMember: deleteMember.mutate,
    uploadPhoto,
    isCreating: createMember.isPending,
    isUpdating: updateMember.isPending,
    isDeleting: deleteMember.isPending,
  };
};
