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
              <div className="flex items-center gap-10">
                <SignInButton mode="modal">
                  <button className="text-white/40 hover:text-white text-[10px] font-mono uppercase tracking-[0.4em] transition-all duration-500">
                    Sign In
                  </button>
                </SignInButton>
                
                <SignUpButton mode="modal">
                  <button className="relative px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-mono uppercase tracking-[0.3em] overflow-hidden group/btn hover:border-white/40 transition-all duration-700">
                    <span className="relative z-10 group-hover/btn:text-black transition-colors duration-500">Claim your spot</span>
                    <div className="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out" />
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
