"use client";

import Link from "next/link";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useActionState, useState } from "react";
import { login, signup } from "../actions";
import { ActionResponse } from "@/app/actions";

const initialState: ActionResponse<null> = {
  success: true,
  data: null,
};

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  // We use the respective action based on the state
  const actionToUse = isLogin ? login : signup;
  const [state, formAction, isPending] = useActionState(actionToUse, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md bg-white border border-border/50 rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Heart className="text-primary fill-primary/20" size={24} />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {isLogin ? "Welcome back." : "Create an account."}
          </h1>
          <p className="text-muted-foreground text-center mt-2 text-sm">
            {isLogin 
              ? "Sign in to continue creating beautiful interactive letters." 
              : "Sign up to start creating beautiful interactive letters for your loved ones."}
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full h-12 rounded-xl border-border/80 text-base font-medium relative opacity-50 cursor-not-allowed"
            disabled
          >
            {/* Google Logo SVG (Mock) */}
            <svg className="absolute left-4 w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google (Soon)
          </Button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-border/60"></div>
            <span className="flex-shrink-0 mx-4 text-muted-foreground text-xs uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-border/60"></div>
          </div>

          <form action={formAction} className="space-y-4">
            <div className="space-y-3">
              {!isLogin && (
                <input 
                  type="text" 
                  name="full_name"
                  placeholder="Nama Lengkap" 
                  className="w-full h-12 px-4 rounded-xl border border-border/60 bg-muted/10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  required={!isLogin}
                />
              )}
              <input 
                type="email" 
                name="email"
                placeholder="you@example.com" 
                className="w-full h-12 px-4 rounded-xl border border-border/60 bg-muted/10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                required
              />
              <input 
                type="password" 
                name="password"
                placeholder="Password" 
                className="w-full h-12 px-4 rounded-xl border border-border/60 bg-muted/10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                required
                minLength={6}
              />
            </div>

            {state && !state.success && (
              <div className="text-sm text-red-500 text-center bg-red-50 p-2 rounded-lg">
                {state.error}
              </div>
            )}

            {state && state.success && !isLogin && (
              <div className="text-sm text-green-600 text-center bg-green-50 p-2 rounded-lg">
                Account created successfully! You can now sign in.
              </div>
            )}

            <Button type="submit" disabled={isPending} className="w-full h-12 rounded-xl text-base font-medium">
              {isPending ? <Loader2 className="animate-spin w-5 h-5" /> : (isLogin ? "Sign In" : "Sign Up")}
            </Button>
          </form>

          <div className="text-center mt-4">
            <button 
              type="button" 
              onClick={() => {
                setIsLogin(!isLogin);
              }}
              className="text-sm text-primary hover:underline"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          By continuing, you agree to our <Link href="#" className="underline hover:text-foreground">Terms of Service</Link> and <Link href="#" className="underline hover:text-foreground">Privacy Policy</Link>.
        </div>
      </div>
    </div>
  );
}
