import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Zap, Mail, Lock, User, Phone, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or Register — EVChargeHub" },
      { name: "description", content: "Sign in or create your EVChargeHub account to book chargers, save favorites and plan trips." },
    ],
  }),
  component: AuthPage,
});

async function redirectAfterLogin(navigate: ReturnType<typeof useNavigate>, userId: string) {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (data) navigate({ to: "/admin/dashboard" });
  else navigate({ to: "/account" });
}

const registerSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().email("Invalid email").max(255),
  mobile: z.string().trim().regex(/^[0-9+\-\s]{7,15}$/, "Invalid mobile number"),
  password: z.string().min(8, "Min 8 characters").max(72),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: "Passwords don't match", path: ["confirm"] });

function passwordStrength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s; // 0..4
}

function AuthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) redirectAfterLogin(navigate, data.session.user.id);
    });
  }, [navigate]);

  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] max-w-md flex-col items-center justify-center px-4 py-10">
      <Link to="/" className="mb-6 flex items-center gap-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow">
          <Zap className="h-5 w-5" />
        </span>
        <span className="text-xl font-bold">EVCharge<span className="text-primary">Hub</span></span>
      </Link>
      <div className="glass w-full rounded-2xl p-6 backdrop-blur-xl">
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="phone">Phone OTP</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-6">
            <LoginForm />
          </TabsContent>
          <TabsContent value="phone" className="mt-6">
            <PhoneOtpForm />
          </TabsContent>
          <TabsContent value="register" className="mt-6">
            <RegisterForm />
          </TabsContent>
        </Tabs>
        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-white/10" /> or <span className="h-px flex-1 bg-white/10" />
        </div>
        <GoogleButton />
        <div className="mt-4 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">Continue as guest →</Link>
        </div>
      </div>
    </div>
  );
}

function GoogleButton() {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
        if (result.error) {
          toast.error("Google sign-in failed");
          setLoading(false);
          return;
        }
        if (result.redirected) return;
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          const { data: role } = await supabase
            .from("user_roles").select("role")
            .eq("user_id", data.user.id).eq("role", "admin").maybeSingle();
          window.location.href = role ? "/admin/dashboard" : "/account";
        } else {
          window.location.href = "/account";
        }
      }}
    >
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Continue with Google
    </Button>
  );
}

function LoginForm() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", remember: true });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Invalid login");
      return;
    }
    toast.success("Welcome back!");
    if (data.user) await redirectAfterLogin(navigate, data.user.id);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label>Email or Mobile</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Password</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9 pr-10" type={show ? "text" : "password"} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
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
          if (!form.email) return toast.error("Enter your email first");
          const { error } = await supabase.auth.resetPasswordForEmail(form.email, { redirectTo: window.location.origin + "/reset-password" });
          if (error) toast.error(error.message); else toast.success("Reset link sent");
        }}>Forgot?</button>
      </div>
      <Button type="submit" className="w-full shadow-glow" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Login
      </Button>
    </form>
  );
}

function RegisterForm() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", mobile: "", password: "", confirm: "" });
  const strength = passwordStrength(form.password);
  const strengthLabels = ["Too weak", "Weak", "Okay", "Strong", "Excellent"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500", "bg-primary"];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin + "/auth",
        data: { full_name: form.full_name.trim(), mobile: form.mobile.trim() },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    if (data.session?.user) {
      toast.success("🎉 Account created! Welcome to EVChargeHub");
      await redirectAfterLogin(navigate, data.session.user.id);
    } else {
      toast.success("🎉 Account created! Please check your email to verify your address.");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="space-y-2">
        <Label>Full Name</Label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Arjun Sharma" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Mobile Number</Label>
        <div className="relative">
          <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" required value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="+91 98765 43210" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Password</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9 pr-10" type={show ? "text" : "password"} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShow((v) => !v)}>
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {form.password && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`h-1 flex-1 rounded ${i < strength ? strengthColors[strength] : "bg-white/10"}`} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{strengthLabels[strength]}</p>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label>Confirm Password</Label>
        <Input type={show ? "text" : "password"} required value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder="Re-enter password" />
      </div>
      <Button type="submit" className="w-full shadow-glow" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Create Account
      </Button>
      <p className="flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 text-primary" />
        We'll send a verification link to your email. You must verify before signing in.
      </p>
    </form>
  );
}

function PhoneOtpForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const normalizedPhone = () => {
    const digits = phone.replace(/\D/g, "");
    const local = digits.startsWith("91") ? digits.slice(2) : digits;
    if (local.length !== 10) return null;
    return `+91${local}`;
  };

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const p = normalizedPhone();
    if (!p) return toast.error("Enter a valid 10-digit Indian mobile number");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: p });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success(`OTP sent to ${p}`);
    setStep("otp");
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const p = normalizedPhone();
    if (!p) return;
    if (otp.length < 6) return toast.error("Enter the 6-digit OTP");
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({ phone: p, token: otp, type: "sms" });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Signed in!");
    if (data.user) await redirectAfterLogin(navigate, data.user.id);
  };

  if (step === "phone") {
    return (
      <form onSubmit={sendOtp} className="space-y-4">
        <div className="space-y-2">
          <Label>Mobile Number</Label>
          <div className="relative flex">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">+91</span>
            <div className="relative flex-1">
              <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="rounded-l-none pl-9"
                inputMode="numeric"
                maxLength={10}
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="98765 43210"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">We'll text you a 6-digit verification code.</p>
        </div>
        <Button type="submit" className="w-full shadow-glow" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Send OTP
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={verifyOtp} className="space-y-4">
      <div className="space-y-2">
        <Label>Enter OTP sent to +91 {phone}</Label>
        <Input
          inputMode="numeric"
          maxLength={6}
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="123456"
          className="tracking-[0.5em] text-center text-lg"
        />
      </div>
      <Button type="submit" className="w-full shadow-glow" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Verify & Sign In
      </Button>
      <button type="button" className="w-full text-xs text-muted-foreground hover:text-foreground" onClick={() => { setStep("phone"); setOtp(""); }}>
        ← Change number
      </button>
    </form>
  );
}