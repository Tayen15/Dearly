"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type ActionState = {
  success: boolean;
  error?: string;
  message?: string;
};

export async function updateProfile(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: "Not logged in" };
  }

  const newFullName = formData.get("full_name") as string;
  if (!newFullName || newFullName.trim() === "") {
    return { success: false, error: "Nama lengkap tidak boleh kosong" };
  }

  // 1. Update the public.profiles table
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ full_name: newFullName })
    .eq("id", user.id);

  if (profileError) {
    return { success: false, error: profileError.message };
  }

  // 2. Update auth.users metadata
  await supabase.auth.updateUser({
    data: { full_name: newFullName }
  });

  revalidatePath("/dashboard/settings");
  return { success: true, message: "Profil berhasil diperbarui!" };
}
