"use client";

import { useState, type FormEvent } from "react";

export type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export type ContactFormStatus = "idle" | "loading" | "success" | "error";

const emptyForm: ContactFormState = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export function useContactForm() {
  const [form, setForm] = useState<ContactFormState>(emptyForm);
  const [status, setStatus] = useState<ContactFormStatus>("idle");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: "contact",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed");
      }

      setStatus("success");
      setForm(emptyForm);
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  }

  return {
    form,
    setForm,
    status,
    handleSubmit,
  };
}
