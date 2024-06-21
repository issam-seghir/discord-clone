import { prisma } from "@/lib/prismadb";
import { getCurrentProfile } from "@/lib/query";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
	try {
		const { name, imageUrl } = await req.json();
		const profile = await getCurrentProfile();
		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const server = await prisma.server.create({
			data: {
				profileId: profile.id,
				name,
				imageUrl,
				inviteCode: uuidv4(),
				channels: {
					create: [{ name: "general", profileId: profile.id }],
				},
				members: {
					create: [{ role: MemberRole.ADMIN, profileId: profile.id }],
				},
			},
		});

		return NextResponse.json(server);
	} catch (error: any) {
		console.log(error, "SERVERS API ERROR");
		return new NextResponse("Internal Error", { status: 500 });
	}
}
