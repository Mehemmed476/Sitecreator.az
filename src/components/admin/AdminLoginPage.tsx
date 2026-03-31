"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useLocale } from "next-intl";
import { Code2, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { StatusMessage } from "@/components/ui/StatusMessage";

export default function AdminLoginPage() {
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: `/${locale}/admin`,
      });

      if (result?.error) {
        setError("Email və ya şifrə yanlışdır.");
      } else {
        window.location.assign(result?.url ?? `/${locale}/admin`);
      }
    } catch {
      setError("Giriş zamanı xəta baş verdi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-shell flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-glow">
            <Code2 className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold">
            Site<span className="text-primary">creator</span>
          </h1>
          <p className="mt-1 text-sm text-muted">İdarə paneli</p>
        </div>

        <form onSubmit={handleLogin} className="admin-panel space-y-5 rounded-[32px] p-8">
          <div className="mb-2 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">Daxil ol</h2>
            <p className="mt-1 text-sm text-muted">
              Portfolio, mesajlar və kalkulyator ayarlarını bir yerdən idarə et.
            </p>
          </div>

          {error ? (
            <StatusMessage
              tone="error"
              title="Giriş alınmadı"
              role="alert"
              className="animate-fade-in-up"
              compact
            >
              {error}
            </StatusMessage>
          ) : null}

          <div className="space-y-1.5">
            <label htmlFor="admin-email" className="admin-form-label flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              E-poçt
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@sitecreator.az"
              className="admin-form-control w-full px-4 py-3.5 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="admin-password" className="admin-form-label flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              Şifrə
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="************"
                className="admin-form-control w-full px-4 py-3.5 pr-12 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted transition-colors hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center text-base disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              "Daxil ol"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
