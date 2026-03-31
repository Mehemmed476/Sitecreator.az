import type { Dispatch, FormEvent, SetStateAction } from "react";
import { AlertCircle, CheckCircle, Mail, MessageSquare, Phone, Send, User } from "lucide-react";
import type { ContactFormState, ContactFormStatus } from "@/components/contact/useContactForm";

export function ContactFormSection({
  kicker,
  title,
  description,
  labels,
  placeholders,
  submitText,
  successText,
  errorText,
  form,
  status,
  onSubmit,
  onFormChange,
}: {
  kicker: string;
  title: string;
  description: string;
  labels: {
    name: string;
    email: string;
    phone: string;
    message: string;
  };
  placeholders: {
    name: string;
    email: string;
    phone: string;
    message: string;
  };
  submitText: string;
  successText: string;
  errorText: string;
  form: ContactFormState;
  status: ContactFormStatus;
  onSubmit: (event: FormEvent) => Promise<void>;
  onFormChange: Dispatch<SetStateAction<ContactFormState>>;
}) {
  return (
    <form onSubmit={onSubmit} className="site-card-strong space-y-6 rounded-[2rem] p-8 sm:p-10">
      <div className="space-y-3">
        <p className="site-kicker">{kicker}</p>
        <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
        <p className="max-w-2xl text-muted">{description}</p>
      </div>

      <Field
        id="contact-name"
        label={labels.name}
        icon={User}
        value={form.name}
        onChange={(value) => onFormChange((prev) => ({ ...prev, name: value }))}
        placeholder={placeholders.name}
      />

      <Field
        id="contact-email"
        type="email"
        label={labels.email}
        icon={Mail}
        value={form.email}
        onChange={(value) => onFormChange((prev) => ({ ...prev, email: value }))}
        placeholder={placeholders.email}
      />

      <Field
        id="contact-phone"
        label={labels.phone}
        icon={Phone}
        value={form.phone}
        onChange={(value) => onFormChange((prev) => ({ ...prev, phone: value }))}
        placeholder={placeholders.phone}
      />

      <TextAreaField
        id="contact-message"
        label={labels.message}
        icon={MessageSquare}
        value={form.message}
        onChange={(value) => onFormChange((prev) => ({ ...prev, message: value }))}
        placeholder={placeholders.message}
      />

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary w-full justify-center text-base disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "loading" ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : (
          <>
            {submitText}
            <Send className="h-4 w-4" />
          </>
        )}
      </button>

      {status === "success" ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="h-4 w-4 shrink-0" />
          {successText}
        </div>
      ) : null}

      {status === "error" ? (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorText}
        </div>
      ) : null}
    </form>
  );
}

function Field({
  id,
  type = "text",
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  type?: "text" | "email";
  label: string;
  icon: typeof User;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </label>
      <input
        id={id}
        type={type}
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="site-input w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

function TextAreaField({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  icon: typeof MessageSquare;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </label>
      <textarea
        id={id}
        required
        rows={6}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="site-input w-full resize-none rounded-xl px-4 py-3 text-sm transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
