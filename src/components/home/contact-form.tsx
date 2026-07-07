"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

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
          <input
            id="name"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm outline-none ring-[var(--ring)] focus:ring-2"
            placeholder={t("namePlaceholder")}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="from" className="text-sm font-medium">
            {t("emailLabel")}
          </label>
          <input
            id="from"
            type="email"
            required
            value={form.from}
            onChange={(e) => setForm((f) => ({ ...f, from: e.target.value }))}
            className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm outline-none ring-[var(--ring)] focus:ring-2"
            placeholder={t("emailPlaceholder")}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium">
          {t("messageLabel")}
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          className="resize-none rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm outline-none ring-[var(--ring)] focus:ring-2"
          placeholder={t("messagePlaceholder")}
        />
      </div>
      <Button type="submit" className="self-start">
        {t("submit")}
        <Send className="h-4 w-4" />
      </Button>
      <p className="text-xs text-[var(--muted-foreground)]">{t("hint")}</p>
    </form>
  );
}
