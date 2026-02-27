import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Navbar } from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-ui" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "DevThoughts | One thought. One day. One community.",
  description: "A beautifully minimal platform where developers share the global Thought of the Day.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#7C3AED",
          colorBackground: "#0D0D0D",
          colorInputBackground: "#1A1A1A",
          colorText: "#F4F4F5",
          borderRadius: "4px",
        }
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${jetbrains.variable} font-ui antialiased min-h-screen relative transition-colors duration-500`}
        >
          <ThemeProvider 
            attribute="class" 
            defaultTheme="system" 
            enableSystem 
            disableTransitionOnChange
          >
            {/* Global Noise Overlay */}
            <div className="noise-overlay" />
            
            {/* Ambient Glows */}
            <div className="blob-gradient-1" />
            <div className="blob-gradient-2" />

            <Navbar />
            <div>
              {children}
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
