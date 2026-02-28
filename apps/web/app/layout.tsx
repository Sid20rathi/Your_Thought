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
      localization={{
        signIn: { start: { title: "Sign in to Thinkr" } },
        signUp: { start: { title: "Create your Thinkr account" } },
      }}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#A855F7",
          colorBackground: "#050505",
          colorInputBackground: "#0D0D0D",
          colorText: "#F4F4F5",
          colorTextSecondary: "#A1A1AA",
          borderRadius: "12px",
          fontFamily: "var(--font-ui)",
        },
        elements: {
          card: "border border-white/10 bg-black/60 backdrop-blur-3xl shadow-2xl",
          headerTitle: "text-white tracking-tight",
          headerSubtitle: "text-zinc-400",
          socialButtonsBlockButton: "bg-white/5 border-white/10 hover:bg-white/10 transition-all",
          socialButtonsBlockButtonText: "text-white font-medium",
          formButtonPrimary: "bg-purple-600 hover:bg-purple-500 transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)]",
          formFieldInput: "bg-white/5 border-white/10 focus:border-purple-500/50 transition-all",
          footerActionLink: "text-purple-400 hover:text-purple-300",
          dividerLine: "bg-white/10",
          dividerText: "text-zinc-500",
        }
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${jetbrains.variable} font-ui antialiased min-h-screen relative transition-colors duration-500`}
        >
          <ThemeProvider 
            attribute="class" 
            defaultTheme="dark" 
            enableSystem={false}
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
