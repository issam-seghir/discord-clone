import { prisma } from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs/server";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import {v4 as uuidv4} from "uuid";

import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/query";
export async function POST(req: Request) {
	try {
		const {name, imageUrl} = await req.json();
		const profile = await getCurrentProfile();
		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 });
		}
	} catch (error: any) {
		console.log(error, "SERVERS API ERROR");
		return new NextResponse("Internal Error", { status: 500 });
	}
}
