/**
 * Sign-in page
 * 
 * The <SignIn /> component is pre-built by Clerk.
 * It handles email/password login, Google OAuth,
 * forgot password, email verification — everything.
 * We just render it and Clerk does the rest.
 */

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  );
}