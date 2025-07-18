// supabase/functions/validate-lead/index.ts
// Supabase Edge Function – Validate Lead & Persist
// Deployed via `supabase functions deploy validate-lead`
// Expects JSON body matching payload sent by leadbouncer.js
// { form_id, customer_id, email, elapsed_seconds, status, reason, mouse_log, submitted_at }
// Returns { status: 'blocked' | 'passed' }

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Environment variables are automatically injected by Supabase platform
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

Deno.serve(async (req) => {
  console.log('[validate-lead] Received request:', req.method, req.url);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch (_) {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Basic shape validation (MVP)
  const {
    form_id,
    email,
    phone = null,
    status = 'passed',
    reason = null,
    score = null,
    elapsed_seconds = null,
    data = null,
    submitted_at = null,
  } = payload;

  if (!form_id || !email) {
    return new Response(
      JSON.stringify({ error: 'form_id and email required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Insert lead into DB (service role bypasses RLS by default)
  console.log('[validate-lead] Attempting to insert lead:', { form_id, email, status, reason });
  
  const { data: insertData, error } = await supabase.from('leads').insert({
    form_id,
    email,
    phone,
    status,
    reason,
    score,
    elapsed_seconds,
    data,
    created_at: submitted_at ?? new Date().toISOString(),
  });

  if (error) {
    console.error('[validate-lead] DB insert error:', error);
    return new Response(
      JSON.stringify({ error: 'DB error', details: error.message }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    );
  }
  
  console.log('[validate-lead] Lead inserted successfully:', insertData);

  return new Response(
    JSON.stringify({ status }),
    { 
      status: 200, 
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      } 
    }
  );
}); 