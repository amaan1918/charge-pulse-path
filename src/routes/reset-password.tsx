import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, Eye, EyeOff, Zap } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset Password — EVChargeHub" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 8) return toast.error("Password must be at least 8 characters");
    if (pw !== confirm) return toast.error("Passwords don't match");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated. Please sign in.");
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md flex-col items-center justify-center px-4 py-10">
      <div className="mb-6 flex items-center gap-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow">
          <Zap className="h-5 w-5" />
        </span>
        <span className="text-xl font-bold">EVCharge<span className="text-primary">Hub</span></span>
      </div>
      <div className="glass w-full rounded-2xl p-6 backdrop-blur-xl">
        <h1 className="text-2xl font-bold">Reset your password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {ready ? "Choose a new password to sign back in." : "Open the reset link from your email to continue."}
        </p>
        {ready && (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label>New Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9 pr-10" type={show ? "text" : "password"} required value={pw} onChange={(e) => setPw(e.target.value)} placeholder="At least 8 characters" />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShow((v) => !v)}>
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input type={show ? "text" : "password"} required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter password" />
            </div>
            <Button type="submit" className="w-full shadow-glow" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Update Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}