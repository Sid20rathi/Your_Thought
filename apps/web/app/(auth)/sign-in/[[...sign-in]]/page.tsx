import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#050505] relative">
      <div className="noise-overlay" />
      <div className="relative z-10">
        <SignIn path="/sign-in" appearance={{ elements: { rootBox: "mx-auto" } }} />
      </div>
    </div>
  );
}
