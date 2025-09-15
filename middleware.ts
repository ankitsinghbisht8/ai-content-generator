import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

export default clerkMiddleware((auth, req) => {
    if (isProtectedRoute(req)) auth().protect()
  })


// Allow public access to landing page "/" and the dashboard for guest trial.
// Protect sensitive areas: billing, history, settings.
const isProtectedRoute = createRouteMatcher([
  '/dashboard/billing(.*)',
  '/dashboard/history(.*)',
  '/dashboard/settings(.*)'
]);


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};