import { prisma } from "@/lib/prismadb";
import { getCurrentProfile } from "@/lib/query";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
	try {
		const profile = await getCurrentProfile();
		const { searchParams } = new URL(req.url);
		const { name,type } = await req.json();
		const serverId = searchParams.get("serverId");

		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 });
		}
		if (!serverId) {
			return new NextResponse("Server not found", { status: 404 });
		}
        if (name === "general") {
            return new NextResponse("Channel name can't be 'general'", { status: 400 });
        }



		const server = await prisma.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                        },
                    },
                },
            },
            data: {
                channels: {
                    create: {
                        profileId: profile.id,
                        name,
                        type,
                    },
                },
            },
		});

		return NextResponse.json(server);
	} catch (error: any) {
		console.log(error, "MEMBER ID  API ERROR");
		return new NextResponse("Internal Error", { status: 500 });
	}
}

