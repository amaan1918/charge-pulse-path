import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail, Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Login — EVChargeHub" }, { name: "robots", content: "noindex" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", remember: true });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;
      const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", data.session.user.id).eq("role", "admin").maybeSingle();
      if (role) navigate({ to: "/admin/dashboard" });
    })();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: form.email.trim(), password: form.password });
    if (error || !data.session) {
      setLoading(false);
      return toast.error("Invalid admin credentials");
    }
    const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", data.session.user.id).eq("role", "admin").maybeSingle();
    setLoading(false);
    if (!role) {
      await supabase.auth.signOut();
      return toast.error("This account is not an admin");
    }
    toast.success("Welcome, admin");
    navigate({ to: "/admin/dashboard" });
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md flex-col items-center justify-center px-4 py-10">
      <div className="mb-6 flex items-center gap-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow">
          <Shield className="h-5 w-5" />
        </span>
        <span className="text-xl font-bold">Admin Console</span>
      </div>
      <form onSubmit={submit} className="glass w-full space-y-4 rounded-2xl p-6 backdrop-blur-xl">
        <div className="space-y-2">
          <Label>Admin Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="admin@evchargehub.in" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9 pr-10" type={show ? "text" : "password"} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShow((v) => !v)}>
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-muted-foreground">
            <input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} /> Remember me
          </label>
          <button type="button" className="text-primary hover:underline" onClick={async () => {
            if (!form.email) return toast.error("Enter email first");
            const { error } = await supabase.auth.resetPasswordForEmail(form.email, { redirectTo: window.location.origin + "/admin" });
            if (error) toast.error(error.message); else toast.success("Reset link sent");
          }}>Forgot?</button>
        </div>
        <Button type="submit" className="w-full shadow-glow" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Sign in to Admin
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Not an admin? <Link to="/auth" className="text-primary hover:underline">User login →</Link>
        </p>
      </form>
    </div>
  );
}