import type React from "react";
import "@/app/globals.css";
import { Manrope } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";
import { NextAuthProvider } from "@/components/next-auth-provider";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata = {
  title: "Abhinav Kumar Choudhary",
  description:
    "Personal website showcasing my work as a designer and developer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={manrope.className}>
        <NextAuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <Analytics />
            <Toaster
              theme="dark"
              position="bottom-right"
              expand={false}
              richColors
              closeButton
              style={{
                background: "hsl(var(--background))",
                color: "hsl(var(--foreground))",
                border: "1px solid hsl(var(--border))",
              }}
            />
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
