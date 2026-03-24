/**
 * middleware.ts - Clerk authentication middleware
 * 
 * This runs BEFORE every request to your app.
 * It checks if the user is logged in and redirects
 * them to the sign-in page if they try to access
 * a protected route without being authenticated.
 * 
 * Public routes (landing page, sign-in, sign-up) are
 * accessible to everyone. Everything else requires login.
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// These routes are accessible WITHOUT being logged in
const isPublicRoute = createRouteMatcher([
  "/",                // Landing page
  "/sign-in(.*)",     // Sign-in page and its sub-routes
  "/sign-up(.*)",     // Sign-up page and its sub-routes
  "/api/webhooks(.*)", // Webhook endpoints (Clerk sends events here)
  "/test-upload",     // Cloudinary image upload dev test page (Sprint 1)
]);

export default clerkMiddleware(async (auth, request) => {
  // If the route is NOT public, require the user to be logged in
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  // This tells Next.js which routes the middleware should run on.
  // It runs on everything EXCEPT static files and Next.js internals.
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};