import Link from 'next/link';
import { ClerkLoaded, ClerkLoading, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';

export async function Navbar() {
  const { userId } = await auth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[100px] transition-all duration-300 ease-in-out bg-black/5 backdrop-blur-sm pointer-events-none border-b border-white/5">
      <div className="max-w-[1800px] mx-auto px-12 h-full flex items-center justify-between pointer-events-auto">
        
        {/* Project Name: Thinkr */}
        <Link href="/" className="group flex items-center">
          <span className="font-mono text-2xl font-bold text-white tracking-widest uppercase transition-all group-hover:tracking-[0.3em] drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            Thinkr
          </span>
        </Link>
        
        {/* Auth Buttons */}
        <div className="flex items-center gap-8">
          <ClerkLoading>
            <div className="w-5 h-5 rounded-full border border-white/20 border-t-white animate-spin" />
          </ClerkLoading>
          <ClerkLoaded>
            {userId ? (
              <div className="flex items-center gap-8">
                <Link href="/dashboard" className="font-mono text-[10px] text-white/50 hover:text-white transition-colors uppercase tracking-[0.3em]">
                  Dashboard
                </Link>
                <div className="scale-110">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-8">
                <SignInButton mode="modal">
                  <button className="text-white/50 hover:text-white text-[10px] font-mono uppercase tracking-[0.3em] transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-white/90 hover:bg-white text-black px-8 py-2.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-[0.2em] transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            )}
          </ClerkLoaded>
        </div>
      </div>
    </nav>
  );
}
