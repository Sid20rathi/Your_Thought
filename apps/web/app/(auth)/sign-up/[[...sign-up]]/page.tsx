import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <SignUp path="/sign-up" appearance={{ elements: { rootBox: "mx-auto" } }} />
    </div>
  );
}
