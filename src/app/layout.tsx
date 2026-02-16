import { ReactQueryProvider } from "@/lib/providers/ReactQueryProvider";
import { ThemeProvider } from "next-themes";
import localFont from "next/font/local";
import "./globals.css";

const helveticaNeue = localFont({
  src: [
    {
      path: "./../../public/helvetica-neue/HelveticaNeueMedium.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./../../public/helvetica-neue/HelveticaNeueBold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-helvetica-neue",
});

const minigap = localFont({
  src: "./../../public/minigap/Gravitype - Minigap.otf",
  display: "swap",
  variable: "--font-minigap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${minigap.variable}`} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${minigap.className} antialiased bg-slate-200 dark:bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
