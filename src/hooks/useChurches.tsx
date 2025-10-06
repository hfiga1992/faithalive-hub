import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Church {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  settings: any;
  created_at: string;
  updated_at: string;
}

export const useChurches = () => {
  return useQuery({
    queryKey: ["churches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("churches")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Church[];
    },
  });
};
