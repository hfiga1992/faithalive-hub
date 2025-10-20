import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// Input validation schema
const memberSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(6).max(128),
  name: z.string().trim().min(1).max(100),
  phone: z.string().regex(/^\d{10,11}$/).optional().or(z.literal('')),
  church_id: z.string().uuid(),
  role: z.enum(['PASTOR', 'LEADER', 'MINISTER', 'MEMBER', 'VISITOR']),
  photo_url: z.string().url().max(500).optional().or(z.literal(''))
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Não autorizado');
    }

    // Verify user has permission (PASTOR or LEADER role)
    const { data: roles } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const hasPermission = roles?.some(r => r.role === 'PASTOR' || r.role === 'LEADER');
    
    if (!hasPermission) {
      throw new Error('Você não tem permissão para criar membros');
    }

    // Parse and validate request body
    let validatedData;
    try {
      const body = await req.json();
      validatedData = memberSchema.parse(body);
    } catch (error) {
      console.error('Validation error:', error);
      throw new Error('Dados de entrada inválidos');
    }

    const { email, password, name, phone, church_id, role, photo_url } = validatedData;

    // Validate only 1 PASTOR per church
    if (role === 'PASTOR') {
      const { data: existingPastor } = await supabaseAdmin
        .from('user_roles')
        .select(`
          user_id,
          profiles!inner(church_id)
        `)
        .eq('role', 'PASTOR')
        .eq('profiles.church_id', church_id)
        .limit(1);

      if (existingPastor && existingPastor.length > 0) {
        throw new Error('Já existe um Pastor cadastrado nesta igreja');
      }
    }

    // Create user using Admin API (won't auto-login)
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name,
        church_id,
      },
    });

    if (createError) throw createError;

    if (!newUser.user) {
      throw new Error('Erro ao criar usuário');
    }

    // Add role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert([{
        user_id: newUser.user.id,
        role: role,
      }]);

    if (roleError) throw roleError;

    // Update profile with additional data
    if (phone || photo_url) {
      await supabaseAdmin
        .from('profiles')
        .update({
          phone: phone,
          photo_url: photo_url,
        })
        .eq('id', newUser.user.id);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: newUser.user,
        message: 'Membro criado com sucesso!' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
