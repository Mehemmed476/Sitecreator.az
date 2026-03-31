"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Eye, EyeOff, Lock, UserRound } from "lucide-react";
import { useLocale } from "next-intl";
import { StatusMessage } from "@/components/ui/StatusMessage";

export function PortalLoginPage() {
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: `/${locale}/portal`,
    });

    if (result?.error) {
      setError("E-poçt və ya şifrə yanlışdır.");
      setLoading(false);
      return;
    }

    window.location.assign(result?.url ?? `/${locale}/portal`);
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1.05fr,0.95fr]">
          <section className="site-card-highlight rounded-[32px] p-8 sm:p-10">
            <p className="site-kicker">Client portal</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Təklifinizi və layihə vəziyyətinizi tək məkandan izləyin
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted sm:text-base">
              Burada sizə göndərilən proposal-ları, aktiv layihə mərhələlərini və aylıq dəstək
              məlumatlarını görə bilərsiniz.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Göndərilən təkliflər",
                "Aktiv layihə mərhələləri",
                "Aylıq dəstək məlumatı",
                "Birbaşa əlaqə detalları",
              ].map((item) => (
                <div key={item} className="site-card-soft rounded-2xl px-4 py-4 text-sm text-muted">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="site-card rounded-[32px] p-8 sm:p-10">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
              <UserRound className="h-5 w-5" />
            </div>

            <h2 className="text-2xl font-semibold">Portala daxil olun</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Admin tərəfindən sizə verilən e-poçt və müvəqqəti şifrə ilə daxil olun.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="space-y-2">
                <label htmlFor="portal-email" className="admin-form-label">
                  E-poçt
                </label>
                <input
                  id="portal-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="admin-form-control w-full px-5 py-4"
                  placeholder="client@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="portal-password" className="admin-form-label">
                  Şifrə
                </label>
                <div className="relative">
                  <input
                    id="portal-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="admin-form-control w-full px-5 py-4 pr-14"
                    placeholder="************"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-foreground"
                    aria-label="Şifrə görünüşünü dəyiş"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error ? (
                <StatusMessage tone="error" title="Giriş alınmadı" role="alert" compact>
                  {error}
                </StatusMessage>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center text-base disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Lock className="h-4 w-4 animate-pulse" />
                    Daxil olunur...
                  </span>
                ) : (
                  "Portalda davam et"
                )}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
