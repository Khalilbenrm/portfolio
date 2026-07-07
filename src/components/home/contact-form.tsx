"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, User, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const fieldClass =
  "w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-[var(--accent)] ring-[var(--ring)] focus:ring-2";

export function ContactForm({ email }: { email: string }) {
  const [form, setForm] = useState({ name: "", from: "", message: "" });
  const t = useTranslations("ContactForm");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`${t("subjectPrefix")} — ${form.name || t("defaultName")}`);
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
            {t("nameLabel")}
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={fieldClass}
              placeholder={t("namePlaceholder")}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="from" className="text-sm font-medium">
            {t("emailLabel")}
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <input
              id="from"
              type="email"
              required
              value={form.from}
              onChange={(e) => setForm((f) => ({ ...f, from: e.target.value }))}
              className={fieldClass}
              placeholder={t("emailPlaceholder")}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium">
          {t("messageLabel")}
        </label>
        <div className="relative">
          <MessageSquare className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-[var(--muted-foreground)]" />
          <textarea
            id="message"
            required
            rows={5}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            className={`${fieldClass} resize-none`}
            placeholder={t("messagePlaceholder")}
          />
        </div>
      </div>
      <Button type="submit" className="w-full justify-center sm:w-auto sm:self-start">
        {t("submit")}
        <Send className="h-4 w-4" />
      </Button>
      <p className="text-xs text-[var(--muted-foreground)]">{t("hint")}</p>
    </form>
  );
}
