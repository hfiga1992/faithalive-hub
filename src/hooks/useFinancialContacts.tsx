import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export const useFinancialContacts = () => {
  const { church } = useAuth();
  const queryClient = useQueryClient();

  const { data: contacts, isLoading } = useQuery({
    queryKey: ["financial-contacts", church?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_contacts")
        .select("*")
        .eq("church_id", church?.id)
        .order("name");

      if (error) throw error;
      return data;
    },
    enabled: !!church?.id,
  });

  const createContact = useMutation({
    mutationFn: async (contact: {
      name: string;
      email?: string;
      phone?: string;
      phone2?: string;
      document?: string;
      address?: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from("financial_contacts")
        .insert({
          ...contact,
          church_id: church?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-contacts"] });
      toast.success("Contato criado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao criar contato: " + error.message);
    },
  });

  const updateContact = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from("financial_contacts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-contacts"] });
      toast.success("Contato atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar contato: " + error.message);
    },
  });

  const deleteContact = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("financial_contacts")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-contacts"] });
      toast.success("Contato removido com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao remover contato: " + error.message);
    },
  });

  return {
    contacts,
    isLoading,
    createContact,
    updateContact,
    deleteContact,
  };
};
