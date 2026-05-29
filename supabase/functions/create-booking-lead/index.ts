// Supabase Edge Function: create-booking-lead
// Saves the intake form data and returns the booking_lead record.
// Step 2 of the booking flow.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const { data, error } = await supabase
      .from("booking_leads")
      .insert({
        full_name: body.full_name,
        email: body.email,
        business_name: body.business_name,
        business_website: body.business_website ?? null,
        business_size: body.business_size ?? null,
        challenge_type: body.challenge_type,
        referral_source: body.referral_source ?? null,
        pre_call_answers: body.pre_call_answers ?? null,
        call_type: body.call_type,
        call_duration_min: body.call_duration_min,
        status: "intake_complete",
      })
      .select()
      .single();

    if (error || !data) {
      console.error("Insert error:", error);
      return new Response(JSON.stringify({ error: "Database insert failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ lead: data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("create-booking-lead error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
