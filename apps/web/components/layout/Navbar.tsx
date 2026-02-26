import Link from 'next/link';
import { ClerkLoaded, ClerkLoading, SignInButton, UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { ThemeToggle } from '@/components/theme-toggle';

export async function Navbar() {
  const { userId } = await auth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-300 ease-in-out bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5">
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 flex items-center justify-center border border-[#7C3AED]/30 bg-[#7C3AED]/10 text-[#7C3AED] dark:text-[#9D65FF] font-mono text-sm leading-none transition-all group-hover:scale-105 group-hover:shadow-[0_0_12px_rgba(124,58,237,0.25)] rounded-[2px]">
            dt
          </div>
          <span className="font-mono text-sm text-[#18181B] dark:text-white/70 tracking-tight transition-colors group-hover:text-black dark:group-hover:text-white/90">
            devthoughts
          </span>
        </Link>
        
        {/* Nav Links (Centered) */}
        <div className="hidden md:flex items-center gap-8">
          {["Home", "How it works", "Archive"].map((item) => (
            <Link 
              key={item} 
              href={item === "Home" ? "/" : `/${item.toLowerCase().replace(/ /g, '-')}`}
              className="font-ui text-sm text-[#52525B] hover:text-[#18181B] dark:hover:text-[#F4F4F5] relative group transition-colors"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#18181B] dark:bg-[#F4F4F5] transition-all duration-200 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Auth & Theme Toggle */}
        <div className="flex items-center justify-end gap-4 min-w-[120px]">
          <ThemeToggle />
          <ClerkLoading>
            <div className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 border-t-black/40 dark:border-t-white/40 animate-spin" />
          </ClerkLoading>
          <ClerkLoaded>
            {userId ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="font-mono text-xs text-[#52525B] hover:text-[#7C3AED] dark:hover:text-[#9D65FF] transition-colors uppercase tracking-widest hidden sm:block">
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <SignInButton mode="modal" signUpFallbackRedirectUrl="/dashboard">
                <button className="border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03] text-[#18181B] dark:text-white/70 px-4 py-1.5 rounded-sm text-sm font-ui transition-all duration-150 ease-out hover:border-[#7C3AED] hover:bg-[#7C3AED]/10 hover:text-[#7C3AED] dark:hover:text-[#9D65FF] active:scale-95">
                  Sign In
                </button>
              </SignInButton>
            )}
          </ClerkLoaded>
        </div>
      </div>
    </nav>
  );
}
