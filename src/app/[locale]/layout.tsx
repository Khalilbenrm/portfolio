import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getSiteConfig } from "@/lib/content";
import { routing, type Locale } from "@/i18n/routing";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const site = getSiteConfig(locale as Locale);

  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = l === routing.defaultLocale ? site.domain : `${site.domain}/${l}`;
  }

  return {
    metadataBase: new URL(site.domain),
    title: {
      default: `${site.name} — ${site.title}`,
      template: `%s — ${site.name}`,
    },
    description: site.tagline,
    keywords: [
      "Software Engineer",
      "Java",
      "Spring Boot",
      "Microservices",
      "React",
      "Next.js",
      "IoT",
      site.name,
    ],
    authors: [{ name: site.name, url: site.github }],
    alternates: {
      languages,
    },
    openGraph: {
      type: "website",
      title: `${site.name} — ${site.title}`,
      description: site.tagline,
      url: locale === routing.defaultLocale ? site.domain : `${site.domain}/${locale}`,
      siteName: site.name,
      locale: locale === "fr" ? "fr_FR" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name} — ${site.title}`,
      description: site.tagline,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const site = getSiteConfig(locale as Locale);
  const t = await getTranslations("Skip");

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-sm focus:text-[var(--accent-foreground)]"
            >
              {t("toContent")}
            </a>
            <Header site={site} />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer site={site} />
          </ThemeProvider>
          {process.env.VERCEL && <Analytics />}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
