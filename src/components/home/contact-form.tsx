"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactForm({ email }: { email: string }) {
  const [form, setForm] = useState({ name: "", from: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Contact portfolio — ${form.name || "Nouveau message"}`);
    const body = encodeURIComponent(
      `${form.message}\n\n---\n${form.name} <${form.from}>`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium">
            Nom
          </label>
          <input
            id="name"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm outline-none ring-[var(--ring)] focus:ring-2"
            placeholder="Votre nom"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="from" className="text-sm font-medium">
            Email
          </label>
          <input
            id="from"
            type="email"
            required
            value={form.from}
            onChange={(e) => setForm((f) => ({ ...f, from: e.target.value }))}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm outline-none ring-[var(--ring)] focus:ring-2"
            placeholder="vous@exemple.com"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          className="resize-none rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm outline-none ring-[var(--ring)] focus:ring-2"
          placeholder="Décrivez votre projet ou votre demande..."
        />
      </div>
      <Button type="submit" className="self-start">
        Envoyer le message
        <Send className="h-4 w-4" />
      </Button>
      <p className="text-xs text-[var(--muted-foreground)]">
        Ouvre votre client email avec le message pré-rempli.
      </p>
    </form>
  );
}
