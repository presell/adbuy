import { supabase } from "./supabaseClient";

/**
 * Fetch the base user (from public.users view)
 * and merge with user_metadata.
 */
export async function getUserById(userId: string) {
  // 1. Fetch from read-only VIEW
  const { data: baseUser, error: baseError } = await supabase
    .from("users")  // VIEW
    .select("*")
    .eq("id", userId)
    .single();

  if (baseError) {
    console.error("[users] Error fetching base user:", baseError);
    throw baseError;
  }

  // 2. Fetch metadata from real table
  const { data: metadata } = await supabase
    .from("user_metadata")
    .select("*")
    .eq("user_id", userId)
    .single();

  // 3. Return merged record
  return {
    ...baseUser,
    ...(metadata || {}),
  };
}

/**
 * Set or update the user's Stripe customer ID
 */
export async function updateStripeCustomerId(userId: string, customerId: string) {
  const { error } = await supabase
    .from("user_metadata")
    .upsert({
      user_id: userId,
      stripe_customer_id: customerId,
    });

  if (error) {
    console.error("[users] Error updating Stripe customer id:", error);
    throw error;
  }

  return true;
}
