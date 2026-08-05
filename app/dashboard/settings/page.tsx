"use client";

import { useActionState } from "react";
import { updateProfile, type ActionState } from "./actions";
import { Button } from "@/components/ui/button";
import { Loader2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const initialState: ActionState = {
  success: false,
  error: "",
  message: "",
};

export default function SettingsPage() {
  const [state, formAction, isPending] = useActionState(
    updateProfile,
    initialState,
  );
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");

        // Fetch from profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        if (profile) {
          setFullName(profile.full_name);
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground font-heading flex items-center gap-2">
          <User className="text-primary" /> Pengaturan Profil
        </h2>
        <p className="text-muted-foreground mt-2">
          Kelola informasi pribadi dan pengaturan akun Anda.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border/60 p-6 md:p-8">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form action={formAction} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full h-12 px-4 rounded-xl border border-border/60 bg-muted/30 text-muted-foreground text-sm cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Email tidak dapat diubah saat ini.
                </p>
              </div>

              <div>
                <label
                  htmlFor="full_name"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-border/60 bg-muted/10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  required
                />
              </div>
            </div>

            {state?.error && (
              <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
                {state.error}
              </div>
            )}

            {state?.success && state?.message && (
              <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
                {state.message}
              </div>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="h-12 px-8 rounded-xl"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin mr-2 w-4 h-4" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
