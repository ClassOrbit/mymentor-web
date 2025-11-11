
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  // 1. Import Supabase client
  // Note: we're using 'https://esm.sh/' to import Node-style packages
  const { createClient, SupabaseClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  const { corsHeaders } = await import('../_shared/cors.ts');

  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 2. Get the classroom name from the request body
    const { name, subject } = await req.json();

    // 3. Create a Supabase client with the user's auth token
    const authHeader = req.headers.get('Authorization')!;
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // 4. Get the user's session data
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('User not found');

    // 5. Create a Supabase *Admin* client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 6. *** SECURITY CHECK ***
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;
    if (profile.role !== 'teacher') {
      return new Response(JSON.stringify({ error: 'Only teachers can create classrooms' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 7. All checks passed! Create the classroom.
    const { data: newClassroom, error: classError } = await supabaseAdmin
      .from('Classroom')
      .insert({ name, subject })
      .select()
      .single();

    if (classError) throw classError;

    // 8. Automatically enroll the teacher in their new class
    const { error: enrollError } = await supabaseAdmin
      .from('Enrollment')
      .insert({
        user_id: user.id,
        classroom_id: newClassroom.id,
        role: 'TEACHER',
      });

    if (enrollError) throw enrollError;

    // 9. Return the new classroom data
    return new Response(JSON.stringify(newClassroom), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
