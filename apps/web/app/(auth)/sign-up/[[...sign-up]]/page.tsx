import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#050505] relative">
      <div className="noise-overlay" />
      <div className="relative z-10">
        <SignUp path="/sign-up" appearance={{ elements: { rootBox: "mx-auto" } }} />
      </div>
    </div>
  );
}
