// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

Deno.serve(async (req) => {
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  const { corsHeaders } = await import('../_shared/cors.ts');

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // join code
    const { join_code } = await req.json();

    //get the user's ID
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing Authorization header');

    const userClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('User not found');

    // create an admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: classroom, error: codeError } = await supabaseAdmin
      .from('Classroom')
      .select('id')
      .eq('join_code', join_code)
      .single();

    if (codeError) {
      throw new Error('Classroom not found or invalid join code.');
    }

    // creating the new enrollment record
    const { error: enrollError } = await supabaseAdmin
      .from('Enrollment')
      .insert({
        user_id: user.id,
        classroom_id: classroom.id,
        role: 'STUDENT',
      });

    if (enrollError) {
      throw new Error('You are already enrolled in this class.');
    }

    return new Response(JSON.stringify({ message: 'Successfully joined class!' }), {
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