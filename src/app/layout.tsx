import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getSiteConfig } from "@/lib/content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const site = getSiteConfig();

export const metadata: Metadata = {
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
  openGraph: {
    type: "website",
    title: `${site.name} — ${site.title}`,
    description: site.tagline,
    url: site.domain,
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.title}`,
    description: site.tagline,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-sm focus:text-[var(--accent-foreground)]"
          >
            Aller au contenu principal
          </a>
          <Header site={site} />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer site={site} />
        </ThemeProvider>
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  );
}
