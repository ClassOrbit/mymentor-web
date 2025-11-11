// Setup type definitions
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient } from "@supabase/supabase-js";
import pdf from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { corsHeaders } from "../_shared/cors.ts";

const TEXT_SPLITTER_CHUNK_SIZE = 1000;
const TEXT_SPLITTER_CHUNK_OVERLAP = 200;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // get User and Admin clients
    const authHeader = req.headers.get('Authorization')!;
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) throw new Error('User not found');

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const classroomId = formData.get('classroomId') as string;

    const { data: enrollment, error: enrollError } = await supabaseAdmin
      .from('Enrollment')
      .select('role')
      .eq('user_id', user.id)
      .eq('classroom_id', classroomId)
      .single();

    if (enrollError || enrollment.role !== 'TEACHER') {
      return new Response(JSON.stringify({ error: 'Forbidden: Not a teacher for this class' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: resource, error: resourceError } = await supabaseAdmin
      .from('Resource')
      .insert({
        classroom_id: classroomId,
        uploader_id: user.id,
        original_filename: file.name,
        pinecone_namespace: "legacy_pinecone_id",
        ingestion_status: 'PROCESSING',
      })
      .select('id')
      .single();
    if (resourceError) throw resourceError;

    const fileBuffer = await file.arrayBuffer();
    const pdfData = await pdf(fileBuffer);
    
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: TEXT_SPLITTER_CHUNK_SIZE,
      chunkOverlap: TEXT_SPLITTER_CHUNK_OVERLAP,
    });
    const chunks = await textSplitter.splitText(pdfData.text);

    //Vectorization (Embedding) Turn each chunk into a vector
    const { data: embeddings } = await supabaseAdmin.ai.embed({
      model: 'text-embedding-ada-002',
      input: chunks,
    });

    const sections = chunks.map((chunk, index) => ({
      resource_id: resource.id,
      classroom_id: classroomId,
      content: chunk,
      embedding: embeddings[index],
    }));

    const { error: insertError } = await supabaseAdmin
      .from('DocumentSection')
      .insert(sections);
    
    if (insertError) throw insertError;
    
    
    await supabaseAdmin
      .from('Resource')
      .update({ ingestion_status: 'COMPLETED' })
      .eq('id', resource.id);

    return new Response(JSON.stringify({ message: 'File processed successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});