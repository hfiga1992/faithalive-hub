import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useChurchRegistration = () => {
  const registerChurch = useMutation({
    mutationFn: async (formData) => {
      const { data, error } = await supabase.functions.invoke(
        'register-new-church',
        { body: formData }
      );

      if (error) {
      }
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        throw new Error(`Registro bem-sucedido, mas o login falhou: ${signInError.message}`);
      }

      return data;
    },
    onSuccess: () => {
      toast.success('Igreja registrada com sucesso! Redirecionando para o dashboard...');
    },
    onError: (error) => {
      toast.error(`Falha no registro: ${error.message}`);
    }
  });

  return {
    registerChurch: registerChurch.mutate,
    isRegistering: registerChurch.isPending,
    error: registerChurch.error
  };
};
