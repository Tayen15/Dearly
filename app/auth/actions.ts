/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ActionResponse } from "@/app/actions";

export async function login(prevState: any, formData: FormData): Promise<ActionResponse<null>> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // Use absolute path or route relative to origin for redirecting
  redirect("/dashboard");
}

export async function signup(prevState: any, formData: FormData): Promise<ActionResponse<null>> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string || "User";
  
  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      }
    }
  });

  if (error) {
    return { success: false, error: error.message };
  }
  
  // A successful signup might require email confirmation, 
  // but we can return success and let the client show a message or redirect
  return { success: true, data: null };
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
