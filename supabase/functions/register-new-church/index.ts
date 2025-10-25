import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PREDEFINED_MINISTRIES = [
  {
    internal_id: "louvor",
    name: "Louvor",
    description: "Ministério de louvor e adoração",
    icon: "Music",
    color: "#FF5733",
    features: ["biblioteca_musicas", "sets_louvor", "escalas"]
  },
  {
    internal_id: "midia",
    name: "Mídia",
    description: "Gestão de fotos e vídeos",
    icon: "Video",
    color: "#33FF57",
    features: ["galeria_midia", "upload", "compartilhamento"]
  },
  {
    internal_id: "intercession",
    name: "Intercessão",
    description: "Ministério de oração e intercessão",
    icon: "Heart",
    color: "#3357FF",
    features: ["pedidos_oracao", "calendario_oracao"]
  },
  {
    internal_id: "diaconia",
    name: "Diaconia",
    description: "Ministério de assistência social",
    icon: "Users",
    color: "#FF33F5",
    features: ["beneficiarios", "donativos"]
  },
  {
    internal_id: "evangelismo",
    name: "Evangelismo",
    description: "Ministério de evangelização",
    icon: "Zap",
    color: "#F5FF33",
    features: ["visitantes", "acompanhamento"]
  },
  {
    internal_id: "estudo",
    name: "Estudo Bíblico",
    description: "Ministério de ensino e estudo",
    icon: "Book",
    color: "#33FFF5",
    features: ["aulas", "materiais"]
  },
  {
    internal_id: "comunicacao",
    name: "Comunicação",
    description: "Ministério de comunicação",
    icon: "Megaphone",
    color: "#FF8C33",
    features: ["avisos", "redes_sociais"]
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { 
      email, 
      password, 
      fullName, 
      churchName, 
      cnpj, 
      address, 
      phone, 
      churchType, 
      churchSize, 
      planType 
    } = await req.json();

    console.log('Starting church registration for:', email);

    // 1. Create user in authentication
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName }
    });

    if (authError) {
      console.error('Auth error:', authError);
      throw new Error(`Authentication error: ${authError.message}`);
    }

    const userId = authData.user?.id;
    if (!userId) throw new Error('User was not created.');

    console.log('User created:', userId);

    // 2. Create the church
    const { data: churchData, error: churchError } = await supabaseAdmin
      .from('churches')
      .insert({
        name: churchName,
        address,
        phone,
        email,
        settings: {
          cnpj,
          church_type: churchType,
          church_size: churchSize
        }
      })
      .select()
      .single();

    if (churchError) {
      console.error('Church error:', churchError);
      throw new Error(`Error creating church: ${churchError.message}`);
    }

    const churchId = churchData.id;
    console.log('Church created:', churchId);

    // 3. Create user profile and associate with church
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userId,
        name: fullName,
        church_id: churchId,
        status: 'ACTIVE'
      });

    if (profileError) {
      console.error('Profile error:', profileError);
      throw new Error(`Error creating profile: ${profileError.message}`);
    }

    console.log('Profile created for user:', userId);

    // 4. Assign PASTOR role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'PASTOR'
      });

    if (roleError) {
      console.error('Role error:', roleError);
      throw new Error(`Error assigning role: ${roleError.message}`);
    }

    console.log('PASTOR role assigned to user:', userId);

    // 5. Create church plan
    const planConfig: Record<string, { max_leaders: number; max_members: number; features: string[] }> = {
      freemium: { max_leaders: 1, max_members: 100, features: ['basic_dashboard', 'member_management'] },
      premium: { max_leaders: 5, max_members: 500, features: ['basic_dashboard', 'member_management', 'financial_module', 'events'] },
      enterprise: { max_leaders: 999, max_members: 9999, features: ['all_features'] }
    };

    const config = planConfig[planType] || planConfig.freemium;

    const { error: planError } = await supabaseAdmin
      .from('church_plans')
      .insert({
        church_id: churchId,
        plan_type: planType,
        max_leaders: config.max_leaders,
        max_members: config.max_members,
        features: config.features,
        status: 'active'
      });

    if (planError) {
      console.error('Plan error:', planError);
      throw new Error(`Error creating plan: ${planError.message}`);
    }

    console.log('Church plan created:', planType);

    // 6. Create predefined ministries
    const ministriesToInsert = PREDEFINED_MINISTRIES.map(m => ({
      ...m,
      church_id: churchId,
      is_active: true
    }));

    const { error: ministriesError } = await supabaseAdmin
      .from('ministries')
      .insert(ministriesToInsert);

    if (ministriesError) {
      console.error('Ministries error:', ministriesError);
      throw new Error(`Error creating ministries: ${ministriesError.message}`);
    }

    console.log('Predefined ministries created');

    // 7. Create onboarding record
    const { error: onboardingError } = await supabaseAdmin
      .from('church_onboarding')
      .insert({
        church_id: churchId,
        step: 1,
        ministries_customized: true, // Since we just created them
        first_leader_added: false
      });

    if (onboardingError) {
      console.error('Onboarding error:', onboardingError);
      throw new Error(`Error creating onboarding: ${onboardingError.message}`);
    }

    console.log('Onboarding record created');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Church registered successfully!",
        church_id: churchId,
        user_id: userId
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Error in church registration:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
