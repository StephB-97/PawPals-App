/**
 * Sign-up page
 * 
 * Same idea as sign-in — Clerk's <SignUp /> component
 * handles the entire registration flow including
 * email verification and OAuth.
 */

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp />
    </div>
  );
}