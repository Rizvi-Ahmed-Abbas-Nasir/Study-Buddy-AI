import { authMiddleware } from "@clerk/nextjs";

// Define your public routes
const publicRoutes = [
  "/",
  "/api/webhook",
  "/sign-in",
  "/sign-up"
];

export default authMiddleware({
  publicRoutes: publicRoutes
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
