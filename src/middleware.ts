import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";


const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/api/uploadthing"]);

// protect all routes except the public one
export default clerkMiddleware(
	(auth, request) => {
		if (!isPublicRoute(request)) {
			auth().protect();
		}
	},
	{ debug: process.env.NODE_ENV === "development" }
);

export const config = {
	// The following matcher runs middleware on all routes
	// except static assets.
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
